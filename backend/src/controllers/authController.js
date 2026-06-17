const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'gtech_secret_key_2026_super_secure';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gtech_refresh_token_secret_key_2026';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: 'CUSTOMER',
        isActive: true
      }
    });

    // Automatically initialize an empty cart for new customer
    await prisma.cart.create({
      data: { customerId: user.id }
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to user
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Make sure customer has a cart initialized
    const existingCart = await prisma.cart.findUnique({
      where: { customerId: user.id }
    });
    if (!existingCart && user.role === 'CUSTOMER') {
      await prisma.cart.create({
        data: { customerId: user.id }
      });
    }

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const refresh = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh Token Error:', error.message);
    res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
};

const logout = async (req, res) => {
  const { token } = req.body;

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshToken: null }
      });
    }
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    // If token verify fails, just respond success to clear client-side state
    res.json({ message: 'Logged out.' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email.' });
    }

    // Generate short-lived reset token
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });

    console.log(`Password reset requested for: ${email}. Reset Token: ${resetToken}`);
    // In production, we'd send an email. For now, return the token in response for testing/seeding flows.
    res.json({
      message: 'Password reset instructions generated.',
      resetToken // Return for simplicity in demo/testing
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Error processing forgot password request.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        passwordHash,
        refreshToken: null // Revoke existing sessions
      }
    });

    res.json({ message: 'Password has been successfully updated.' });
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    res.status(400).json({ message: 'Invalid or expired reset token.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ message: 'Server error retrieving user data.' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe
};
