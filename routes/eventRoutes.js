const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById,getAllEventsInactiveActive, updateEvent, deleteEvent } = require('../controllers/eventController');
const { validateEvent } = require('../middleware/validationMiddleware');

router.post('/', validateEvent, createEvent);
router.get('/', getAllEvents);
router.get('/all', getAllEventsInactiveActive);
router.get('/:id', getEventById);
router.put('/:id', validateEvent, updateEvent);
router.delete('/:id', deleteEvent);
module.exports = router;