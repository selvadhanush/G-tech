const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../middleware/schemas');
const { upload, uploadToCloudinary } = require('../utils/uploader');

// Public catalog routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin-only product modification
router.post('/', authMiddleware, adminMiddleware, validate(productSchema), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validate(productSchema), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

// Image uploading route (Admin-only)
router.post('/upload-image', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'gtech_products');
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ message: 'Error uploading image to Cloudinary.' });
  }
});

module.exports = router;
