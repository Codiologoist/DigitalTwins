import fs from "fs";
import path from "path";
import { PatientData } from "../models/Data";
import Patient from "../models/Patient";

/**
 * Reads a file from the decrypted_data directory and returns its contents as a JSON object.
 * @param {string} fileName - The name of the file to read.
 * @returns {Object} The JSON object represented by the file.
 */
function readFile(fileName: string): PatientData {
  // Get the path to the file
  const filePath: string = path.join(
    __dirname,
    "../../decrypted_data",
    fileName
  );
  // Read the file
  const data: string = fs.readFileSync(filePath, "utf8");
  // Convert the file to JSON and return
  return JSON.parse(data);
}

export const getDecryptedData = (): { [key: string]: PatientData } => {
  const directory: string = path.join(__dirname, "../../decrypted_data");
  const files: string[] = fs.readdirSync(directory);
  const data: { [key: string]: PatientData } = {};
  for (const file of files) {
    let splitedFile = file.split(",");
    data[`${splitedFile[0]},${splitedFile[1]}`] = readFile(file);
  }
  return data;
};

const updatePatientData = async () => {
  // Every 5 seconds a new data document is appended
  // We want the data for the past 12 hours to be in the database
  // Older data will be deleted
  // 12 * 60 * 60 / 5 = 720
  // So at all times we have 720 data documents
  const maxDocs = 720;
  let data: { [key: string]: PatientData } = {};
  try {
    data = getDecryptedData();
  } catch (error) {
    return;
  }
  const firstName = data["ABP,Dias"].full_name.split(" ")[0];
  const lastName = data["ABP,Dias"].full_name.split(" ")[1];
  const patient = await Patient.findOne({ name: { firstName, lastName } });
  if (!patient) {
    return;
  }
  if (patient.data["ABP,Dias"].length >= maxDocs) {
    patient.data["ABP,Dias"].shift();
    patient.data["ABP,Mean"].shift();
    patient.data["ABP,Syst"].shift();
    patient.data["HR,na"].shift();
    patient.data["RR,na"].shift();
    patient.data["SpO2,na"].shift();
    patient.data["Tvesic,na"].shift();
    patient.data["rSO2,Left"].shift();
    patient.data["rSO2,Right"].shift();
  }
  patient.data["ABP,Dias"].push(data["ABP,Dias"]);
  patient.data["ABP,Mean"].push(data["ABP,Mean"]);
  patient.data["ABP,Syst"].push(data["ABP,Syst"]);
  patient.data["HR,na"].push(data["HR,na"]);
  patient.data["RR,na"].push(data["RR,na"]);
  patient.data["SpO2,na"].push(data["SpO2,na"]);
  patient.data["Tvesic,na"].push(data["Tvesic,na"]);
  patient.data["rSO2,Left"].push(data["rSO2,Left"]);
  patient.data["rSO2,Right"].push(data["rSO2,Right"]);
  await patient.save();
}

export const updatePatientDataInterval = () => {
  // Every 5 seconds a new data document is appended
  setInterval(updatePatientData, 5000);
};
