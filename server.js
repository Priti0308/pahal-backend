require('dotenv').config();
const express = require('express');
const cors = require('cors');  
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();
 
connectDB(); 
const corsOptions = {
  origin: function (origin, callback) { 
    const allowedOrigins = [
      'http://localhost:5173',  
      'http://localhost:3000', // Create React App default port
      'http://127.0.0.1:5173', 
      'http://127.0.0.1:3000',
      'https://pahal--two.vercel.app'
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Methods', 
    'Access-Control-Allow-Origin', 
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Preflight request handler for all routes
app.options('*', cors(corsOptions));

// Routes
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
// app.use('/api/auth', authRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));
// Global error handler for CORS errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'Access denied by CORS policy'
    });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
