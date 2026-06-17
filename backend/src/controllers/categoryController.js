const prisma = require('../config/prisma');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Error retrieving categories.' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Category with this name or slug already exists.' });
    }

    const category = await prisma.category.create({
      data: { name, slug }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: 'Error creating category.' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id } }
    });
    if (existing) {
      return res.status(400).json({ message: 'Another category with this name already exists.' });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug }
    });
    res.json(category);
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: 'Error updating category.' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ message: 'Error deleting category.' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
