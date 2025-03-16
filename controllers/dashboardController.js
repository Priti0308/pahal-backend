// controllers/dashboardController.js
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get basic stats
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });
    const totalParticipants = await Participant.countDocuments();
    
    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get top 5 events by attendance
    const topEvents = await Event.find()
      .sort({ attendees: -1 })
      .limit(5)
      .select('title attendees category');
    
    // Get recent registrations
    const recentRegistrations = await Participant.find()
      .sort({ registrationDate: -1 })
      .limit(10)
      .populate('eventId', 'title')
      .select('teamName teamLeader.name registrationDate eventId');
    
    // Get registration trends (last 7 days)
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const registrationTrend = await Participant.aggregate([
      { 
        $match: { 
          registrationDate: { $gte: lastWeek } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      overview: {
        totalEvents,
        activeEvents,
        totalParticipants,
        inactiveEvents: totalEvents - activeEvents
      },
      eventsByCategory,
      topEvents,
      recentRegistrations,
      registrationTrend
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics', 
      error: error.message 
    });
  }
};

// Get detailed event statistics for a specific event
exports.getEventDetailedStats = async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Get participant data
      const participantCount = await Participant.countDocuments({ eventId });
      
      // Get daily registration counts for this event
      const registrationsByDay = await Participant.aggregate([
        { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      // Get team size distribution
      const teamSizeDistribution = await Participant.aggregate([
        { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
        {
          $project: {
            teamSize: { $size: "$teamMembers" }
          }
        },
        {
          $group: {
            _id: "$teamSize",
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      res.status(200).json({
        event,
        participantCount,
        registrationsByDay,
        teamSizeDistribution
      });
      
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching event statistics', 
        error: error.message 
      });
    }
  };