const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Security Headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: '*', // For production deployment, you can set it to specific domains
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter for Authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { message: 'Too many login or register attempts, please try again later.' }
});

// Apply rate limiter to auth routes
app.use('/api/auth', authLimiter, authRoutes);

// Other API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to G-TECH Innovation E-Commerce Workstation API.' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong on the server.', 
    error: process.env.NODE_ENV === 'development' ? err.stack : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`G-TECH E-Commerce server is running on port ${PORT}`);
});

// Trigger hot-reload after Prisma Client generation
