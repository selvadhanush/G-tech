const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured successfully.');
} else {
  console.warn('Cloudinary environment variables are missing. File uploads will fall back to mock URLs.');
}

module.exports = {
  cloudinary,
  isConfigured: !!isConfigured,
};
