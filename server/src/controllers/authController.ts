import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Admin from "../models/Admin";
import Doctor from "../models/Doctor";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Please set it in your environment variables in .env file.");
  process.exit(1);
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user = null;
    let userType = null;

    // First, check if the user exists in the Admin collection
    user = await Admin.findOne({ username });
    if (user) {
      userType = "admin";
    } else {
      // If not found in Admin, check in the Doctor collection
      user = await Doctor.findOne({ username });
      if (user) {
        userType = "doctor";
      }
    }

    // If user is still not found, return an error
    if (!user) {
      return res.status(404).json({ success: false, message: "The user could not be found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT with user ID and role
    const token = jwt.sign({ id: user._id, username: user.username, role: userType }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      token,
      role: userType,
      user: {
        id: user._id,
        username: user.username,
      },
      message: `Login successful for ${userType}`,
    });
  } catch (error: any) {
    console.error(`Error during login: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};