const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/orders', authMiddleware, adminMiddleware, adminController.getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);
router.get('/customers', authMiddleware, adminMiddleware, adminController.getCustomers);
router.put('/customers/:id/status', authMiddleware, adminMiddleware, adminController.toggleCustomerStatus);

module.exports = router;
