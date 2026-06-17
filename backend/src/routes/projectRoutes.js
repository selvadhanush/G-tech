const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getAllProjects);
router.get('/:id', getProjectById);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProject);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProject);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

module.exports = router;
