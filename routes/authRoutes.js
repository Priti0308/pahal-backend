const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, changePassword, getLoggedUser } = require('../controllers/authController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.put('/change-password', authMiddleware, changePassword);
router.get('/me', authMiddleware, getLoggedUser);

module.exports = router;