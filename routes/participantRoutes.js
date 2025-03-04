const express = require('express');
const router = express.Router();
const { 
  registerParticipant, 
  getEventParticipants,
  getParticipantReport,
  getAllParticipantReports
} = require('../controllers/participantController');
const { validateParticipant } = require('../middleware/validationMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', validateParticipant, registerParticipant);
router.get('/:eventId/participants', authMiddleware, getEventParticipants);
router.get('/report/:eventId', authMiddleware, getParticipantReport);
router.get('/all-reports', authMiddleware, getAllParticipantReports);

module.exports = router;