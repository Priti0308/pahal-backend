// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  getEventDetailedStats
} = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');
 
// router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/event-stats/:eventId', getEventDetailedStats);

module.exports = router;