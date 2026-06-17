const crypto = require('crypto');
const prisma = require('../config/prisma');

const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ message: 'Missing payment signature verification parameters.' });
  }

  try {
    // 1. Generate local signature
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret')
      .update(text)
      .digest('hex');

    const isVerified = generatedSignature === razorpaySignature;

    if (isVerified) {
      // 2. Find the payment record
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId }
      });

      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found.' });
      }

      // 3. Update payment and order status
      const updatedOrder = await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId,
            razorpaySignature,
            transactionId: razorpayPaymentId
          }
        });

        const order = await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: 'SUCCESS',
            orderStatus: 'CONFIRMED'
          },
          include: {
            items: { include: { product: true } },
            address: true
          }
        });

        return order;
      });

      return res.json({ success: true, message: 'Payment verified successfully.', order: updatedOrder });
    } else {
      // Signature mismatch
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId }
      });

      if (payment) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
          });
          await tx.order.update({
            where: { id: payment.orderId },
            data: { paymentStatus: 'FAILED' }
          });
        });
      }

      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Error verifying payment.' });
  }
};

module.exports = {
  verifyPayment
};
