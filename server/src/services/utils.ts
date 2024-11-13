import fs from "fs";
import path from "path";
import { PatientData, Data } from "../models/Data";

/**
 * Reads a file from the decrypted_data directory and returns its contents as a JSON object.
 * @param {string} fileName - The name of the file to read.
 * @returns {Object} The JSON object represented by the file.
 */
async function readFile(fileName: string): Promise<PatientData> {
  // Get the path to the file
  const filePath: string = path.join(
    __dirname,
    "../../decrypted_data",
    fileName
  );
  // Read the file
  const data: string = await fs.promises.readFile(filePath, "utf-8");
  // Convert the file to JSON and return
  return JSON.parse(data);
}


/**
 * Retrieves all decrypted patient data from the decrypted_data directory.
 * 
 * Reads each file in the directory, parses it into a JSON object,
 * and stores it in a key-value pair format, where the key is a combination
 * of the first two parts of the file name, separated by a comma, and the value
 * is the parsed PatientData object.
 *
 * @returns {Promise<{ [key: string]: PatientData }>} A promise that resolves
 *          to an object containing the decrypted patient data indexed by
 *          their respective keys.
 */
export const getDecryptedData = async (): Promise<{ [key: string]: PatientData }> => {
  const directory: string = path.join(__dirname, "../../decrypted_data");
  const files: string[] = fs.readdirSync(directory);
  const data: { [key: string]: PatientData } = {};
  for (const file of files) {
    let splitedFile = file.split(".");
    data[`${splitedFile[0]}`] = await readFile(file);
  }
  return data;
};
