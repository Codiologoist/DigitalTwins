import { Request, Response } from "express";
import { getDecryptedData } from "../services/utils";
import { PatientData } from "../models/Patient";

// Controller for sending all categories of patient based on the patient id
export const sendPatientData = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Assuming only '1' is valid for now
  if (id !== "1") {
    return res.status(404).json({
      success: false,
      message: `Patient with ID ${id} not found`,
    });
  }

  try {
    // Fetch patient data (simulated)
    const patientData: { [key: string]: PatientData } = getDecryptedData();

    return res.status(200).json({
      success: true,
      data: patientData,
    });
  } catch (error: any) {
    // Handle and log errors
    console.error(`Error fetching patient data: ${error.message || error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while retrieving patient data",
    });
  }
};

// Controller for sending specific category of patient data based on the patient id
export const sendPatientCategoryData = async (req: Request, res: Response) => {
  const { id, category } = req.params;

  // Assuming only '1' is valid for now
  if (id !== "1") {
    return res.status(404).json({
      success: false,
      message: `Patient with ID ${id} not found`,
    });
  }

  try {
    // Fetch patient data (simulated)
    const patientData: { [key: string]: PatientData } = getDecryptedData();

    // Check if the requested category exists in patientData
    if (!patientData.hasOwnProperty(category)) {
      return res.status(404).json({
        success: false,
        message: `Category ${category} not found for patient with ID ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: patientData[category as keyof typeof patientData], // Explicitly tell TypeScript that 'category' is a key of 'patientData'
    });
  } catch (error: any) {
    // Handle and log errors
    console.error(
      `Error fetching patient category data: ${error.message || error}`
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while retrieving patient category data",
    });
  }
};
