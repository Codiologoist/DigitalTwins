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
    if (file !== '.DS_Store') {
      let splitedFile = file.split(".");    
      data[`${splitedFile[0]}`] = await readFile(file);
    }
  }
  return data;
};

// Function to retrieve decrypted data from MongoDB using Mongoose
export const getDecryptedDataFromDB = async (): Promise<{ [key: string]: PatientData }> => {
  try {

    // Using Mongoose query data
    const documents = await Data.find();

    console.log("Retrieved documents from MongoDB:", documents);

    // Map the retrieved documents into the desired format
    const data: { [key: string]: PatientData } = {};

    documents.forEach((doc) => {
      // For each document, use the signal_type as the key
      const signalType = doc.signal_type;

      // Add the document directly to the result object using signal_type as the key
      // `doc` is already a Mongoose document, so it is automatically typed as `PatientData`
      data[signalType] = doc;
    });

    return data;
  } catch (error) {
    console.error("Error retrieving decrypted data from MongoDB:", error);
    throw new Error("Failed to fetch data from MongoDB");
  }
};