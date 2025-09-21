const Registration = require('../models/Registration');

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate('eventId', 'title');
    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations' });
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
    );
    res.json({ registration });
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration' });
  }
};

module.exports = {
  getAllRegistrations,
  updateRegistrationStatus
};