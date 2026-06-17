const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categorySchema } = require('../middleware/schemas');

router.get('/', categoryController.getCategories);
router.post('/', authMiddleware, adminMiddleware, validate(categorySchema), categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, validate(categorySchema), categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;
