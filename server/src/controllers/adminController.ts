import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import Admin from "../models/Admin";

// Controller to create a admin
export const createAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Verify that the request body contains the necessary information
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check whether the user name already exists
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
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
};

// Controller to get all doctors
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({});
    return res.status(200).json({ success: true, data: doctors });
  } catch (error: any) {
    console.error(`Error fetching doctors: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to get a specific doctor by _id
export const getDoctorById = async (req: Request, res: Response) => {
  const { id } = req.params;  // Use id from the params instead of _id

  try {
    // Find the doctor by _id
    const doctor = await Doctor.findOne({ _id: id });

    // If doctor not found, return 404
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with ID ${id} not found` });  // Update the error message to use ID
    }

    // If doctor found, return doctor data
    return res.status(200).json({ success: true, data: doctor });
  } catch (error: any) {
    console.error(`Error fetching doctor: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to create a doctor
export const createDoctor = async (req: Request, res: Response) => {
  const { firstName, lastName, SSN, username, password } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !SSN || !username || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (firstName, lastName, SSN, username, password) are required.",
    });
  }

  try {
    // Check if a doctor with the same SSN or username already exists
    const existingDoctor = await Doctor.findOne({ $or: [{ SSN }, { username }] });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this SSN or username already exists.",
      });
    }

    // Create and save the new doctor
    const newDoctor = new Doctor({
      firstName,
      lastName,
      SSN,
      username,
      password,
    });
    await newDoctor.save();

    return res.status(201).json({ success: true, data: newDoctor });
  } catch (error: any) {
    console.error(`Error creating doctor: ${error.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

// Controller to delete a doctor by id
export const deleteDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;  // Use id from the params instead of SSN

  try {
    const deletedDoctor = await Doctor.findOneAndDelete({ _id: id });  // Query using _id

    if (!deletedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with ID ${id} not found` });  // Update the error message to use ID
    }

    return res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error: any) {
    console.error(`Error deleting doctor: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to update doctor details by id
export const updateDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;  // Use id from the params instead of SSN
  const { firstName, lastName, username, password } = req.body;

  // Validate that at least one field is provided to update
  if (!firstName && !lastName && !username && !password) {
    return res.status(400).json({
      success: false,
      message: "At least one field (firstName, lastName, username, password) must be provided to update.",
    });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: id },  // Query using _id
      { firstName, lastName, username, password },
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with ID ${id} not found` });  // Update the error message to use ID
    }

    return res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error: any) {
    console.error(`Error updating doctor: ${error.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};
