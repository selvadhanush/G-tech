const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { checkoutSchema } = require('../middleware/schemas');

router.post('/', authMiddleware, validate(checkoutSchema), orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
