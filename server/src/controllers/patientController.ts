import { Request, Response } from "express";
import { getDecryptedData, runPythonScript, getDecryptedDataFromDB } from "../services/utils";
import { PatientData, AllData, Data, DataTypes} from "../models/Data";

import Patient from "../models/Patient";
import router from "../routes/api";

// Controller for sending all categories of patient based on the patient id
export const sendPatientData = async (req: Request, res: Response) => {
  const { SSN } = req.params;
  const { duration, test, first, path } = req.query;

  try {
    const patient = await Patient.findOne({ SSN: SSN });

    if (!patient) {
      console.error(`Patient with SSN ${SSN} not found`);
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }

    try {
      await runPythonScript(parseInt(duration as string), test as string === "true", first as string === "true", path as string);
    } catch (error: any) {
      console.error(`Error running python script: ${error.message || error}`);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error while running python script",
      });
    }
    // Fetch patient data (simulated)
    const patientData: { [key: string]: PatientData } = await getDecryptedData();

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
  const { SSN, category } = req.params;
  const { duration, test, first, path } = req.query;

  try {
    const patient = await Patient.findOne({ SSN: SSN });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }

    try {
      await runPythonScript(parseInt(duration as string), test as string === "true", first as string === "true", path as string);
    } catch (error: any) {
      console.error(`Error running python script: ${error.message || error}`);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error while running python script",
      });
    }
    // Fetch patient data
    const patientData: { [key: string]: PatientData } = await getDecryptedData();

    // Check if the requested category exists in patientData
    if (!patientData.hasOwnProperty(category)) {
      return res.status(404).json({
        success: false,
        message: `Category ${category} not found for patient with SSN ${SSN}`,
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


export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find({});

    return res.status(200).json({ success: true, data: patients });
  } catch (error: any) {
    console.error(`Error fetching patients: ${error.message || error}`);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const createPatient = async (req: Request, res: Response) => {
  const { firstName, lastName , SSN, path} = req.body;

  try {
    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ SSN });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: "Patient already exists with this SSN" });
    }

    const newPatient = new Patient({
      firstName,
      lastName,
      SSN,
      data: new AllData(),
      path
    });

    try {
      await newPatient.validate();
    } catch (error: any) {
      console.error(`Error validating patient: ${error.message || error}`);
      return res
        .status(400)
        .json({ success: false, message: `${error.message || "Patient validation failed"}` });
    }

    await newPatient.save();
    return res.status(201).json({ success: true, patient: newPatient });
  } catch (error: any) {
    console.error(`Error creating patient: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const deletePatient = async (req: Request, res: Response) => {
  const { SSN } = req.params;

  try {
    const deletedPatient = await Patient.findOneAndDelete({ SSN });

    if (!deletedPatient) {
      return res
        .status(404)
        .json({ success: false, message: `Patient with SSN ${SSN} not found` });
    }

    return res
      .status(200)
      .json({ success: true, message: "Patient deleted successfully" });
  } catch (error: any) {
    console.error(`Error deleting patient: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const updatePatient = async (req: Request, res: Response) => {
  const { SSN } = req.params;
  const { firstName, lastName , path } = req.body;

  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { SSN },
      { firstName, lastName, path },
      { new: true }
    );

    if (!updatedPatient) {
      return res
        .status(404)
        .json({ success: false, message: `Patient with SSN ${SSN} not found` });
    }

    return res
      .status(200)
      .json({ success: true, message: "Patient updated successfully", patient: updatedPatient });
  } catch (error: any) {
    console.error(`Error updating patient: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const getOnePatient = async (req: Request, res: Response) => {
  const { SSN } = req.params;

  try {
    const patient = await Patient.findOne({ SSN }); // Find patient by SSN

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: `Patient with SSN ${SSN} not found` });
    }

    return res.status(200).json({ success: true, data: patient });
  } catch (error: any) {
    console.error(`Error fetching patient: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
