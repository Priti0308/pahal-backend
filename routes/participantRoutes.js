const express = require('express');
const router = express.Router();
const { 
  registerParticipant, 
  getEventParticipants,
  getParticipantReport,
  getAllParticipantReports,
  getParticipantCount,
  getParticipantById,
  getParticipantsByEventId
} = require('../controllers/participantController');
const { validateParticipant } = require('../middleware/validationMiddleware'); 

router.post('/register', validateParticipant, registerParticipant);
router.get('/:eventId/participants',  getEventParticipants);
router.get('/report/:eventId',  getParticipantReport);
router.get('/all-reports',  getAllParticipantReports);

// New routes
router.get('/count', getParticipantCount);
router.get('/:id', getParticipantById);
router.get('/event/:eventId', getParticipantsByEventId);

module.exports = router;  