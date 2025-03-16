const Joi = require('joi');

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().optional(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    __v: Joi.number().optional(),
    title: Joi.string().required(),
    emoji: Joi.string().optional(), 
    category: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().optional(),
    location: Joi.string().required(),
    bannerImage: Joi.string().uri().optional(),
    description: Joi.string().required(),
    teamSize: Joi.number().optional(),

    registrationFee: Joi.string().optional(),
    attendees: Joi.number().optional(),
    prizes: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        title: Joi.string(),
        amount: Joi.string(),
        description: Joi.string().optional(),
        icon: Joi.string().optional(),
        color: Joi.string().optional()
      })
    ).optional(),
    schedule: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        round: Joi.string(),
        date: Joi.string(),
        description: Joi.string().optional()
      })
    ).optional(),
    guidelines: Joi.array().items(Joi.string()).optional(),
    faqs: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        question: Joi.string(),
        answer: Joi.string()
      })
    ).optional(),
    sponsors: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string(),
        image: Joi.string().optional()
      })
    ).optional(),
    coordinators: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string(),
        contact: Joi.string().optional(),
        image: Joi.string().optional()
      })
    ).optional(),
    quickInfo: Joi.object({
      _id: Joi.string().optional(),
      teamSize: Joi.string().optional(),
      prizePool: Joi.string().optional(),
      duration: Joi.string().optional(),
      eligibility: Joi.string().optional()
    }).optional(),
    resources: Joi.array().items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string(),
        icon: Joi.string().optional(),
        url: Joi.string().uri().optional()
      })
    ).optional(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ 
    error: error.details[0].message,
    details: error.details
  });
  
  next();
};

const validateParticipant = (req, res, next) => {
  const schema = Joi.object({
    eventId: Joi.string().required(),
    teamName: Joi.string().required(),
    teamLeader: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required()
    }).required(),
    teamMembers: Joi.array().items(
      Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        college: Joi.string().optional()
      })
    ).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ 
    error: error.details[0].message,
    details: error.details
  });
  
  next();
};

module.exports = {
  validateEvent,
  validateParticipant
};