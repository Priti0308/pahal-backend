require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");

const app = express();

// --- Connect Database ---
connectDB();

// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", // CRA default
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://pahal--two.vercel.app", // your frontend on Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight requests

// --- Middleware ---
app.use(bodyParser.json());

// --- Routes ---
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/participants", require("./routes/participantRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin/dashboard", require("./routes/dashboardRoutes"));

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("Error:", err.message); // log full error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Access denied by CORS policy" });
  }
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
