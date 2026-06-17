const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addressSchema } = require('../middleware/schemas');

router.get('/', authMiddleware, addressController.getAddresses);
router.post('/', authMiddleware, validate(addressSchema), addressController.createAddress);
router.put('/:id', authMiddleware, validate(addressSchema), addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports = router;
