const prisma = require('../config/prisma');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({ message: 'Error retrieving testimonials.' });
  }
};

const createTestimonial = async (req, res) => {
  const { customerName, rating, review } = req.body;

  if (!customerName || rating === undefined || !review) {
    return res.status(400).json({ message: 'customerName, rating, and review are required.' });
  }

  const parsedRating = parseInt(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        rating: parsedRating,
        review,
      },
    });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    res.status(500).json({ message: 'Error submitting testimonial.' });
  }
};

const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { customerName, rating, review } = req.body;

  try {
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    let parsedRating = existingTestimonial.rating;
    if (rating !== undefined) {
      parsedRating = parseInt(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
      }
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        customerName: customerName || existingTestimonial.customerName,
        rating: parsedRating,
        review: review || existingTestimonial.review,
      },
    });

    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    res.status(500).json({ message: 'Error updating testimonial.' });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    res.status(500).json({ message: 'Error deleting testimonial.' });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
