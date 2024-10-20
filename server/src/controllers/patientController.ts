import { Request, Response } from "express";
import { getDecryptedData } from "../services/utils";
import { PatientData, AllData, Data, DataTypes} from "../models/Data";
import Patient from "../models/Patient";

// Controller for sending all categories of patient based on the patient id
export const sendPatientData = async (req: Request, res: Response) => {
  const { SSN } = req.params;

  try {
    const patient = await Patient.findOne({ SSN: SSN });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }
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
  const { SSN, category } = req.params;

  try {
    const patient = await Patient.findOne({ SSN: SSN });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }
    // Fetch patient data (simulated)
    const patientData: { [key: string]: PatientData } = getDecryptedData();

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

    return res.status(200).json({ success: true, patients: patients });
  } catch (error: any) {
    console.error(`Error fetching patients: ${error.message || error}`);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const createPatient = async (req: Request, res: Response) => {
  const { name: { firstName, lastName }, SSN} = req.body;

  try {
    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ SSN });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: "Patient already exists with this SSN" });
    }

    const newPatient = new Patient({
      name: {
        firstName,
        lastName
      },
      SSN,
      data: new AllData(),
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

export const getPatientDataFromDatabase = async (req: Request, res: Response) => {
  const { SSN } = req.params;
  const { index } = req.query;

  try {
    // Find the patient
    const patient = await Patient.findOne({ SSN });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }

    // Ensure the index is provided and is a valid number, default to 0 if not provided
    const indexNumber = parseInt(index as string, 10) || 0;
    if (isNaN(indexNumber) || indexNumber < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid index value. Please provide a positive number.`,
      });
    }

    // Get the maximum length of the data
    const maxLen = patient.data["ABP,Dias"].length;
    if (indexNumber >= maxLen) {
      return res.status(400).json({
        success: false,
        message: `Index ${indexNumber} out of bounds. Max index is ${maxLen - 1}.`,
      });
    }

    // Use Promise.all to fetch the data in parallel for efficiency
    const [abpSyst, abpMean, abpDias, hrNa, rrNa, spo2Na, tvesicNa, rso2Left, rso2Right] = await Promise.all([
      Data.findById(patient.data["ABP,Syst"][indexNumber]),
      Data.findById(patient.data["ABP,Mean"][indexNumber]),
      Data.findById(patient.data["ABP,Dias"][indexNumber]),
      Data.findById(patient.data["HR,na"][indexNumber]),
      Data.findById(patient.data["RR,na"][indexNumber]),
      Data.findById(patient.data["SpO2,na"][indexNumber]),
      Data.findById(patient.data["Tvesic,na"][indexNumber]),
      Data.findById(patient.data["rSO2,Left"][indexNumber]),
      Data.findById(patient.data["rSO2,Right"][indexNumber]),
    ]);

    // Handle case where any of the data is missing
    if (!abpSyst || !abpMean || !abpDias || !hrNa || !rrNa || !spo2Na || !tvesicNa || !rso2Left || !rso2Right) {
      return res.status(404).json({
        success: false,
        message: `Data not found for one or more categories at index ${indexNumber}.`,
      });
    }

    // Construct the DataDoc object
    const DataDoc: DataTypes = {
      "ABP,Syst": abpSyst as PatientData,
      "ABP,Mean": abpMean as PatientData,
      "ABP,Dias": abpDias as PatientData,
      "HR,na": hrNa as PatientData,
      "RR,na": rrNa as PatientData,
      "SpO2,na": spo2Na as PatientData,
      "Tvesic,na": tvesicNa as PatientData,
      "rSO2,Left": rso2Left as PatientData,
      "rSO2,Right": rso2Right as PatientData,
    };

    return res.status(200).json({
      success: true,
      data: DataDoc,
    });

  } catch (error: any) {
    console.error(`Error fetching patient: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getSpecificPatientDataFromDatabase = async (req: Request, res: Response) => {
  const { SSN, category } = req.params;
  const { index } = req.query;

  try {
    // Find the patient
    const patient = await Patient.findOne({ SSN });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with SSN ${SSN} not found`,
      });
    }

    // Ensure the index is provided and is a valid number
    const indexNumber = parseInt(index as string, 10);
    if (isNaN(indexNumber) || indexNumber < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid index value. Please provide a valid number.`,
      });
    }

    // Use bracket notation to access the requested category in patient.data
    const categoryDataArray = patient.data[category as keyof typeof patient.data];

    // Check if the category exists and the index is valid
    if (!categoryDataArray || indexNumber >= categoryDataArray.length) {
      return res.status(404).json({
        success: false,
        message: `Index ${indexNumber} is out of bounds for category ${category}`,
      });
    }

    // Retrieve the ObjectId at the specified index
    const objectIdAtIndex = categoryDataArray[indexNumber];

    // Populate the specific ObjectId
    const populatedData = await Data.findById(objectIdAtIndex);

    if (!populatedData) {
      return res.status(404).json({
        success: false,
        message: `Data not found at index ${indexNumber} for category ${category}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: populatedData,
    });
  } catch (error: any) {
    console.error(`Error fetching patient data: ${error.message || error}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
