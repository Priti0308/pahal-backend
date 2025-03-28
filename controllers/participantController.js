const Participant = require('../models/Participant');
const Event = require('../models/Event');

exports.registerParticipant = async (req, res) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.body.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Create new participant
    const newParticipant = new Participant(req.body);
    const savedParticipant = await newParticipant.save();

    // Update event attendees count
    event.attendees += 1;
    await event.save();

    res.status(201).json(savedParticipant);
  } catch (error) {
    res.status(500).json({ message: 'Error registering participant', error: error.message });
  }
};

exports.getEventParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({ eventId: req.params.eventId });
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching participants', error: error.message });
  }
};
exports.getParticipantReport = async (req, res) => {
    try {
      const { eventId } = req.params;
      
      // Aggregate participants with event details
      const report = await Participant.aggregate([
        { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'eventDetails'
          }
        },
        { $unwind: '$eventDetails' },
        {
          $project: {
            teamName: 1,
            teamLeader: 1,
            teamMembers: 1,
            registrationDate: 1,
            eventTitle: '$eventDetails.title'
          }
        }
      ]);
  
      res.status(200).json({
        totalParticipants: report.length,
        report
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating report', error: error.message });
    }
  };
  
  exports.getAllParticipantReports = async (req, res) => {
    try {
      const reports = await Participant.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'eventDetails'
          }
        },
        { $unwind: '$eventDetails' },
        {
          $group: {
            _id: '$eventId',
            eventTitle: { $first: '$eventDetails.title' },
            totalParticipants: { $sum: 1 },
            participants: { 
              $push: {
                teamName: '$teamName',
                teamLeader: '$teamLeader',
                registrationDate: '$registrationDate'
              }
            }
          }
        }
      ]);
  
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error generating reports', error: error.message });
    }
  };
  exports.getParticipantReport = async (req, res) => {
    try {
      const { eventId } = req.params;
      
      // Aggregate participants with event details
      const report = await Participant.aggregate([
        { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'eventDetails'
          }
        },
        { $unwind: '$eventDetails' },
        {
          $project: {
            teamName: 1,
            teamLeader: 1,
            teamMembers: 1,
            registrationDate: 1,
            eventTitle: '$eventDetails.title'
          }
        }
      ]);
  
      res.status(200).json({
        totalParticipants: report.length,
        report
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating report', error: error.message });
    }
  };
  
  exports.getAllParticipantReports = async (req, res) => {
    try {
      const reports = await Participant.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'eventDetails'
          }
        },
        { $unwind: '$eventDetails' },
        {
          $group: {
            _id: '$eventId',
            eventTitle: { $first: '$eventDetails.title' },
            totalParticipants: { $sum: 1 },
            participants: { 
              $push: {
                teamName: '$teamName',
                teamLeader: '$teamLeader',
                registrationDate: '$registrationDate'
              }
            }
          }
        }
      ]);
  
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error generating reports', error: error.message });
    }
  };
  
  // New controller functions
  
  // Get total participant count
  exports.getParticipantCount = async (req, res) => {
    try {
      const count = await Participant.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching participant count', error: error.message });
    }
  };
  
  // Get participant by ID
  exports.getParticipantById = async (req, res) => {
    try {
      const participant = await Participant.findById(req.params.id);
      if (!participant) {
        return res.status(404).json({ message: 'Participant not found' });
      }
      res.status(200).json(participant);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching participant', error: error.message });
    }
  };
  
  // Get participants by event ID with more details
  exports.getParticipantsByEventId = async (req, res) => {
    try {
      const { eventId } = req.params;
      
      // First verify the event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const participants = await Participant.find({ eventId })
        .select('teamName teamLeader teamMembers registrationDate')
        .sort({ registrationDate: -1 });
      
      const participantCount = participants.length;
      
      // Calculate total team members (including team leaders)
      const totalAttendees = participants.reduce((total, participant) => {
        // Count team leader
        let count = 1;
        // Add team members
        count += participant.teamMembers ? participant.teamMembers.length : 0;
        return total + count;
      }, 0);
      
      res.status(200).json({
        event: {
          id: event._id,
          title: event.title,
          date: event.date
        },
        stats: {
          participantCount,
          totalAttendees
        },
        participants
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching participants', error: error.message });
    }
  };