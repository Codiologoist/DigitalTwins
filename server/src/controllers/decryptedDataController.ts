import { Request, Response } from "express";
import { getDecryptedData } from "../services/utils"; // Assuming this function decrypts and returns the data
import { PatientData, Data, AllData } from "../models/Data";
import Patient from "../models/Patient";

// Controller for saving decrypted data for a patient (appending new data)
export const saveDecryptedData = async (req: Request, res: Response) => {
    const { SSN } = req.params; // Get SSN from request parameters
  
    try {
      // Find the patient by SSN
      const patient = await Patient.findOne({ SSN: SSN });
  
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: `Patient with SSN ${SSN} not found`,
        });
      }
  
      // Decrypt the data
      const decryptedData = await getDecryptedData();
  
      if (!decryptedData) {
        return res.status(400).json({
          success: false,
          message: "No decrypted data available",
        });
      }
  
      const newDataEntries = [];
  
      // Loop through the decrypted data and save each signal type
      for (const signalType in decryptedData) {
        if (decryptedData.hasOwnProperty(signalType)) {
          const data = decryptedData[signalType];
  
          if (!data || !data.data) {
            console.warn(`Missing data for signal type: ${signalType}`);
            continue; // Skip if no data exists
          }
  
          const newData = new Data({
            signal_type: signalType,
            data: data.data,
            patient_first_name: patient.name?.firstName || "Unknown",
            patient_last_name: patient.name?.lastName || "Unknown",
            admission_time: data.admission_time,
          });
  
          newDataEntries.push(newData);
  
          // Update patient with new data IDs
          patient.data[signalType] = patient.data[signalType] || [];
          patient.data[signalType].push(newData._id);
        }
      }
  
      if (newDataEntries.length > 0) {
        await Data.insertMany(newDataEntries); // Bulk insert for performance
      }
  
      await patient.save(); // Save updated patient document
  
      return res.status(200).json({
        success: true,
        message: "Decrypted patient data saved successfully",
      });
    } catch (error: any) {
      console.error(`Error saving decrypted data: ${error.message || error}`);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error while saving decrypted data",
      });
    }
  };
  