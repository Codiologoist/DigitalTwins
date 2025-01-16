import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../types/express.t";

dotenv.config(); // Load environment variable

const JWT_SECRET = process.env.JWT_SECRET; // Retrieve the JWT secret key from environment variables

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Please set it in your environment variables in .env file.");
  process.exit(1);
}

// Middleware function to authenticate users
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the token from the "Authorization" header. The token is expected to be in the format "Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1]; // .split(" ")[1] to avoid errors that occur when the authorization is empty when the user is not logged in

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User; // Type assertion
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is not valid." });
  }
};