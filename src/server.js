const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes/useRoutes'); // Import routes
const connectDB = require('./utils/connectDB');

dotenv.config();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();  // Call the function to connect to the database

// Use routes
app.use('/api', routes);  // takes all routes in route directory "/api"

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});