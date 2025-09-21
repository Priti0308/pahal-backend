require('dotenv').config();
const express = require('express');
const cors = require('cors');  
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

const app = express();

// Connect DB
connectDB(); 

// --- CORS ---
const corsOptions = {
  origin: function (origin, callback) { 
    const allowedOrigins = [
      'http://localhost:5173',  
      'http://localhost:3000',
      'http://127.0.0.1:5173', 
      'http://127.0.0.1:3000',
      'https://pahal--two.vercel.app',
      'https://pahal-frontend.vercel.app'  // 👈 add your actual frontend deploy URL
    ];

    if (!origin || allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Preflight
app.options('*', cors(corsOptions));

// Routes
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Access denied by CORS policy' });
  }
  next(err);
});

// ⚡ IMPORTANT: do not use app.listen() for Vercel
module.exports = app;
