const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById } = require('../controllers/eventController');
const { validateEvent } = require('../middleware/validationMiddleware');

router.post('/', validateEvent, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);

module.exports = router;