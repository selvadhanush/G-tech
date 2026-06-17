const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gtech_secret_key_2026_super_secure');
    
    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ message: 'Token is not valid or has expired.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'GTECH_ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. GTECH Administrator privileges required.' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
