import { Request, Response } from "express";
import Doctor from "../models/Doctor";

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

// Controller to get a specific doctor by SSN
export const getDoctorBySSN = async (req: Request, res: Response) => {
  const { SSN } = req.params;

  try {
    // Find the doctor by SSN
    const doctor = await Doctor.findOne({ SSN });

    // If doctor not found, return 404
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with SSN ${SSN} not found` });
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

  try {
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
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to delete a doctor by SSN
export const deleteDoctor = async (req: Request, res: Response) => {
  const { SSN } = req.params;

  try {
    const deletedDoctor = await Doctor.findOneAndDelete({ SSN });

    if (!deletedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with SSN ${SSN} not found` });
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

// Controller to update doctor details by SSN
export const updateDoctor = async (req: Request, res: Response) => {
  const { SSN } = req.params;
  const { firstName, lastName, username, password } = req.body;

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { SSN },
      { firstName, lastName, username, password },
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: `Doctor with SSN ${SSN} not found` });
    }

    return res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error: any) {
    console.error(`Error updating doctor: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
