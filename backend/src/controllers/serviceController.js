const prisma = require('../config/prisma');
const { uploadToCloudinary } = require('../middleware/upload');

const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(services);
  } catch (error) {
    console.error('Get Services Error:', error);
    res.status(500).json({ message: 'Error retrieving services.' });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get Service Error:', error);
    res.status(500).json({ message: 'Error retrieving service.' });
  }
};

const createService = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800';
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        imageUrl,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(500).json({ message: 'Error creating service.' });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    let imageUrl = req.body.imageUrl || existingService.imageUrl;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: title || existingService.title,
        description: description || existingService.description,
        imageUrl,
      },
    });

    res.json(updatedService);
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(500).json({ message: 'Error updating service.' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    await prisma.service.delete({
      where: { id },
    });

    res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete Service Error:', error);
    res.status(500).json({ message: 'Error deleting service.' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
