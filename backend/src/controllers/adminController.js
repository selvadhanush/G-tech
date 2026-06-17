const prisma = require('../config/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();

    // Calculate total revenue from SUCCESS payments
    const successfulPayments = await prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: {
        amount: true
      }
    });

    // Also include completed COD orders in revenue calculation
    const codDeliveredOrders = await prisma.order.aggregate({
      where: {
        paymentMethod: 'COD',
        orderStatus: 'DELIVERED'
      },
      _sum: {
        totalAmount: true
      }
    });

    const onlineRevenue = successfulPayments._sum.amount || 0;
    const codRevenue = codDeliveredOrders._sum.totalAmount || 0;
    const totalRevenue = onlineRevenue + codRevenue;

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard stats.' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        },
        address: true,
        payment: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: 'Error retrieving orders.' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updatedData = {};
    if (orderStatus) updatedData.orderStatus = orderStatus;
    if (paymentStatus) updatedData.paymentStatus = paymentStatus;

    // Handle stock recovery if cancelled
    if (orderStatus === 'CANCELLED' && order.orderStatus !== 'CANCELLED') {
      // Revert product stocks
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
        await tx.order.update({
          where: { id },
          data: {
            orderStatus: 'CANCELLED',
            paymentStatus: order.paymentMethod === 'ONLINE' && order.paymentStatus === 'SUCCESS' ? 'REFUNDED' : 'FAILED'
          }
        });
      });

      return res.json({ message: 'Order cancelled and stock reverted.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updatedData,
      include: {
        customer: { select: { name: true, email: true } },
        address: true,
        payment: true,
        items: { include: { product: true } }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Error updating order status.' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({ message: 'Error retrieving customers.' });
  }
};

const toggleCustomerStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const customer = await prisma.user.findUnique({
      where: { id }
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, email: true, isActive: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('Toggle Customer Status Error:', error);
    res.status(500).json({ message: 'Error toggling customer status.' });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getCustomers,
  toggleCustomerStatus
};
