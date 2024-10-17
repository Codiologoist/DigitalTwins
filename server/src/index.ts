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
});