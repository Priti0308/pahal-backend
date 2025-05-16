const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  collegeName: { type: String, required: true },
  teamName: { type: String, required: true },
  teamLeader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentDetails: {
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }
  },
  accepted: { type: Boolean, default: false },
  paymentStatus: { type: Boolean, default: false },
  teamMembers: [{
    name: String,
    email: String,
    college: String
  }],
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Participant', participantSchema);