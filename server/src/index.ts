import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import apiRoutes from "./routes/api";
import patientRoutes from "./routes/patient";
import adminRoutes from "./routes/admin";
import loginRoutes from "./routes/login"
import { notFoundHandler } from "./middlewares/errorHandler";
import { authenticate } from "./middlewares/authMiddleware";
import Admin from './models/Admin'; // Import Admin model

// Load environment variables
dotenv.config();

// MongoDB connection setup
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/DigitalTwinsDB"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Function to create default admin user
const createAdmin = async () => {
  try {
    // Check if the admin user already exists
    const adminExists = await Admin.findOne({ username: 'admin123' });

    if (!adminExists) {
      // Create a new admin if not found
      const newAdmin = new Admin({
        username: 'admin123', // Admin username
        password: 'iamtheadmin', // The password to be set for the admin, should be hashed
      });

      // Save the new admin to the database
      await newAdmin.save();
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  }
};

// Initialize express application
const app = express();
const port = process.env.PORT || 5000;

// Apply middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routes
app.use("/api/v1", apiRoutes);
app.use("/api/v1/patients", authenticate, patientRoutes);
app.use("/api/v1/admin", authenticate, adminRoutes);
app.use("/api/v1", loginRoutes);

// Apply error handler
app.use(notFoundHandler);

// Start HTTP server
app.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
  // Call createAdmin function when the server starts
  createAdmin();
});