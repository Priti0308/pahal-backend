 
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  emoji: String,
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: String,
  location: { type: String, required: true },
  bannerImage: String,
  description: { type: String, required: true },
  registrationFee: String,
  attendees: { type: Number, default: 0 },
  prizes: [{
    title: String,
    amount: String,
    description: String,
    icon: String,
    color: String
  }],
  teamSize: { type: Number},
  schedule: [{
    round: String,
    date: String,
    description: String
  }],
  guidelines: [String],
  faqs: [{
    question: String,
    answer: String
  }],
  sponsors: [{
    name: String,
    image: String
  }],
  coordinators: [{
    name: String,
    contact: String,
    image: String
  }],
  quickInfo: {
    teamSize: String,
    prizePool: String,
    duration: String,
    eligibility: String
  },
  resources: [{
    name: String,
    icon: String,
    url: String
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);