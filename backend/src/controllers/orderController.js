const prisma = require('../config/prisma');
const razorpay = require('../config/razorpay');

const TAX_RATE = 0.18; // 18% GST
const SHIPPING_CHARGE = 100; // Flat INR 100 shipping fee

const createOrder = async (req, res) => {
  const customerId = req.user.id;
  const { addressId, paymentMethod } = req.body;

  try {
    // 1. Get Address
    const address = await prisma.address.findUnique({
      where: { id: addressId, customerId }
    });
    if (!address) {
      return res.status(400).json({ message: 'Invalid address selected.' });
    }

    // 2. Get Cart items
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // 3. Calculate Pricing & Check Stock
    let subtotal = 0;
    const orderItemsToCreate = [];

    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}.`
        });
      }

      const itemPrice = product.discountPrice || product.price;
      subtotal += itemPrice * item.quantity;

      orderItemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const totalAmount = subtotal + tax + SHIPPING_CHARGE;

    // 4. Create Order & Items inside a Database Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          customerId,
          addressId,
          paymentMethod,
          paymentStatus: 'PENDING',
          orderStatus: 'PLACED',
          subtotal,
          tax,
          shippingCharge: SHIPPING_CHARGE,
          totalAmount,
          items: {
            create: orderItemsToCreate
          }
        },
        include: {
          items: {
            include: { product: true }
          },
          address: true
        }
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear Cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    // 5. Handle Online Payment (Razorpay Order creation)
    if (paymentMethod === 'ONLINE') {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // in paise
          currency: 'INR',
          receipt: order.id
        });

        // Save Payment details in DB
        await prisma.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            status: 'PENDING'
          }
        });

        return res.status(201).json({
          order,
          razorpayOrder
        });
      } catch (payError) {
        console.error('Razorpay Order Creation Failed:', payError);
        // Return the order so user can pay later
        return res.status(201).json({
          order,
          paymentError: 'Could not initialize online payment. Please retry from your order panel.'
        });
      }
    }

    // COD Flow
    res.status(201).json({ order });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Error processing order.' });
  }
};

const getMyOrders = async (req, res) => {
  const customerId = req.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrls: true,
                brand: true
              }
            }
          }
        },
        address: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Error fetching order history.' });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        },
        address: true,
        payment: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Check ownership unless admin
    if (order.customerId !== customerId && req.user.role !== 'GTECH_ADMIN') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order ID Error:', error);
    res.status(500).json({ message: 'Error retrieving order.' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
