const Registration = require('../models/Registration');
const Event = require('../models/Event');

const getAllRegistrations = async (req, res) => {
  try {
    console.log('Fetching registrations...');
    const registrations = await Registration.find()
      .populate({
        path: 'eventId',
        select: 'title eventDate category',
        model: Event
      })
      .sort({ registrationDate: -1 });

    console.log('Found registrations:', registrations);
    res.status(200).json({ success: true, registrations });
  } catch (error) {
    console.error('Error in getAllRegistrations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('eventId', 'title');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.status(200).json({ success: true, registration });
  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error);
    res.status(500).json({ success: false, message: 'Failed to update registration status' });
  }
};

module.exports = {
  getAllRegistrations,
  updateRegistrationStatus
};