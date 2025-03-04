const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  teamName: { type: String, required: true },
  teamLeader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  teamMembers: [{
    name: String,
    email: String,
    college: String
  }],
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Participant', participantSchema);