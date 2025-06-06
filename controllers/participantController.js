const Participant = require('../models/Participant');
const Event = require('../models/Event');
const { sendAcceptanceEmail } = require('../utils/emailService');

exports.registerParticipant = async (req, res) => {
  try {
    const event = await Event.findById(req.body.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const newParticipant = new Participant(req.body);
    const savedParticipant = await newParticipant.save();

    event.attendees += 1;
    await event.save();

    res.status(201).json(savedParticipant);
  } catch (error) {
    res.status(500).json({ message: 'Error registering participant', error: error.message });
  }
};

exports.acceptParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    if (participant.accepted) {
      return res.status(200).json({ message: 'Participant already accepted', participant });
    }

    participant.accepted = true;
    await participant.save();    
    if (participant.teamLeader && participant.teamLeader.email && participant.eventId) {
      try {
        const event = await Event.findById(participant.eventId);
        if (event) {
          const recipientInfo = {
            email: participant.teamLeader.email,
            name: participant.teamLeader.name,
            teamName: participant.teamName
          };
          const eventInfo = {
            title: event.title,
            date: event.date,
            time: event.time, 
            venue: event.venue,  
          };
          await sendAcceptanceEmail(recipientInfo, eventInfo);
        } else {
          console.error(`Event not found (ID: ${participant.eventId}) for participant ${participant._id}, email not sent.`);
        }
      } catch (emailError) {
        console.error('Failed to send acceptance email (controller level):', emailError);
      }
    } else {
      console.warn(`Participant ${participant._id} is missing email or eventId, acceptance email not sent.`);
    }

    res.status(200).json(participant);
  } catch (error) {
    console.error('Error accepting participant:', error);
    res.status(500).json({ message: 'Error accepting participant', error: error.message });
  }
};

exports.rejectParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    participant.accepted = false;
    await participant.save();

    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting participant', error: error.message });
  }
};

exports.paymentStatus = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    res.status(200).json({ paymentStatus: participant.paymentStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching participants', error: error.message });
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

exports.getParticipantCount = async (req, res) => {
  try {
    const count = await Participant.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching participant count', error: error.message });
  }
};

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

exports.getParticipantsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
 
    const participants = await Participant.find({ eventId })
      .sort({ registrationDate: -1 });

    const participantCount = participants.length;

    const totalAttendees = participants.reduce((total, participant) => {
      let count = 1;
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