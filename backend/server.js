const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON
//app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

app.use(cors({
  origin: 'http://localhost:5173', // allow frontend
  credentials: true               // allow cookies if needed
}));
// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use("/api/questions", require("./routes/questionRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
