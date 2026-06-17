const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/schemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
