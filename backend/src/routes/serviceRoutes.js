const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createService);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateService);
router.delete('/:id', authMiddleware, adminMiddleware, deleteService);

module.exports = router;
