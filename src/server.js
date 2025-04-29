const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const routes = require('./routes/index'); // Import routes
const connectDB = require('./utils/connectDB');

require('./jobs/cronJobs');
import('./middleware/arcjetMiddleware.mjs')
  .then((module) => {
    // Access the default export which is the middleware function
    const arcjetMiddleware = module.default;

    // Use the middleware in your app
    app.use(arcjetMiddleware);
  })
  .catch((error) => {
    console.error('Error loading middleware:', error);
  });
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",  // This allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,  // If you are using cookies or authentication headers
  })
);

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