const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./config/prisma');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for simplicity, can be customized for production
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to G-TECH Innovation Lead Management API.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);

// Admin Dashboard Stats Endpoint
app.get('/api/dashboard/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [contactsCount, projectsCount, servicesCount, testimonialsCount] = await Promise.all([
      prisma.contact.count(),
      prisma.project.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
    ]);

    // Also get recent leads count or status counts if needed
    const submittedCount = await prisma.contact.count({ where: { status: 'Submitted' } });
    const inProgressCount = await prisma.contact.count({ where: { status: 'In Progress' } });
    const completedCount = await prisma.contact.count({ where: { status: 'Completed' } });

    res.json({
      totalContacts: contactsCount,
      totalProjects: projectsCount,
      totalServices: servicesCount,
      totalTestimonials: testimonialsCount,
      statusBreakdown: {
        submitted: submittedCount,
        inProgress: inProgressCount,
        completed: completedCount,
      }
    });
  } catch (error) {
    console.error('Retrieve Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Error retrieving system statistics.' });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong on the server.', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
