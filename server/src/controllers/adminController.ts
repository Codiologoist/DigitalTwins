import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";

// Controller to create an admin
export const createAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Verify that the request body contains the necessary information
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check whether the username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this username already exists" });
    }

    // Create a new administrator and save it
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    // A successful response is returned
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error: any) {
    // Catch possible errors and return server error responses
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: "Error creating admin", error: errorMessage });
  }
};

// Controller to create a doctor
export const createDoctor = async (req: Request, res: Response) => {
  const { firstName, lastName, SSN, username, password } = req.body;

  if (!firstName || !lastName || !SSN || !username || !password) {
    return res.status(400).json({ success: false, message: "All fields (firstName, lastName, SSN, username, password) are required." });
  }

  // Validate SSN to ensure it's 12 digits
  if (!/^\d{12}$/.test(SSN)) {
    return res.status(400).json({ success: false, message: "SSN must be 12 digits" });
  }

  try {
    const existingDoctor = await Doctor.findOne({ $or: [{ SSN }, { username }] });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: "A doctor with this SSN or username already exists." });
    }

    // Hash password (this can be implemented later, as the current code skips it)
    const newDoctor = new Doctor({ firstName, lastName, SSN, username, password });
    await newDoctor.save();

    return res.status(201).json({ success: true, data: newDoctor });
  } catch (error: any) {
    // Error handling for internal server issues
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, message: "Internal Server Error", error: errorMessage });
  }
};

// Controller to get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find();
    //for loop for decrypting passwords
    res.status(200).json({ success: true, data: doctors });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: "Internal Server Error", error: errorMessage });
  }
};

// Controller to get a doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: `Doctor with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: "Internal Server Error", error: errorMessage });
  }
};

// Controller to delete a doctor by ID
export const deleteDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedDoctor = await Doctor.findOneAndDelete({ _id: id });

    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: `Doctor with ID ${id} not found` });
    }

    return res.status(200).json({ success: true, message: "Doctor deleted successfully", data: deletedDoctor });
  } catch (error: any) {
    // Handle errors when deleting a doctor
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, message: "Internal Server Error", error: errorMessage });
  }
};

// Controller to update a doctor's details
export const updateDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;  // Use id from the params instead of SSN
  const { firstName, lastName, username, password, SSN } = req.body;

  // Validate that at least one field is provided to update
  if (!firstName && !lastName && !username && !password && !SSN) {
    return res.status(400).json({
      success: false,
      message: "At least one field (firstName, lastName, username, password) must be provided to update.",
    });
  }

  // If SSN is provided, validate it to be 12 digits
  if (SSN && !/^\d{12}$/.test(SSN)) {
    return res.status(400).json({ success: false, message: "SSN must be 12 digits" });
  }

  try {
    const updateFields: any = {};  // Store only the fields that need to be updated

    // Conditionally add the fields to update
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (username) updateFields.username = username;
    //FIX TO HASH THE PASSWORD
    if (password) {
      const salt = await bcrypt.genSalt(10); // Generate a salt
      updateFields.password = await bcrypt.hash(password, salt);  // Hash the password with salt
    }
    if (SSN) updateFields.SSN = SSN;

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: id },  // Query using _id
      updateFields,  // Only update the fields that were provided
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found`,  // Use ID in the error message
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedDoctor,
    });
  } catch (error: any) {
    // Handle errors when updating a doctor
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: errorMessage,
    });
  }
};
