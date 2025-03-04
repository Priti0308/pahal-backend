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