const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin
    const admin = await Admin.findOne({ 
      _id: decoded.adminId, 
      isActive: true 
    });

    if (!admin) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Attach admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

// Middleware to check if admin is super admin
const superAdminMiddleware = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin rights required.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  superAdminMiddleware
};