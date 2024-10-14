import fs from "fs";
import path from "path";
import { PatientData } from "../models/Patient";

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
