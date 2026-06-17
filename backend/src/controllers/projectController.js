const prisma = require('../config/prisma');
const { uploadToCloudinary } = require('../middleware/upload');

const getAllProjects = async (req, res) => {
  const { category } = req.query;
  try {
    const where = {};
    if (category && category !== 'All') {
      // Direct exact match, or case-insensitive if needed, category works as is
      where.category = category;
    }
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Error retrieving projects.' });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({ message: 'Error retrieving project.' });
  }
};

const createProject = async (req, res) => {
  const { title, description, category, location, completedDate } = req.body;
  if (!title || !description || !category || !location || !completedDate) {
    return res.status(400).json({ message: 'All fields (title, description, category, location, completedDate) are required.' });
  }

  try {
    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800';
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        location,
        completedDate,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Error creating project.' });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, location, completedDate } = req.body;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    let imageUrl = req.body.imageUrl || existingProject.imageUrl;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        category: category || existingProject.category,
        location: location || existingProject.location,
        completedDate: completedDate || existingProject.completedDate,
        imageUrl,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ message: 'Error updating project.' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ message: 'Error deleting project.' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
