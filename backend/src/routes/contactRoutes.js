const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, trackContactStatus, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', createContact);
router.get('/track/:id', trackContactStatus);

router.get('/', authMiddleware, adminMiddleware, getAllContacts);
router.put('/:id', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

module.exports = router;
