const express = require('express');
const router = express.Router();
const { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllTestimonials);
router.post('/', createTestimonial);

router.put('/:id', authMiddleware, adminMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTestimonial);

module.exports = router;
