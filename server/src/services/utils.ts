import fs from "fs";
import path from "path";
import { PatientData, Data } from "../models/Data";
import { spawn } from "child_process";

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
export const getDecryptedData = async (): Promise<{
  [key: string]: PatientData;
}> => {
  const directory: string = path.join(__dirname, "../../decrypted_data");
  const files: string[] = fs.readdirSync(directory);

  const data: { [key: string]: PatientData } = {};
  for (const file of files) {
    if (file !== ".DS_Store") {
      let splitedFile = file.split(".");
      data[`${splitedFile[0]}`] = await readFile(file);
    }
  }
  return data;
};


// Function to retrieve decrypted data from MongoDB using Mongoose
export const getDecryptedDataFromDB = async (): Promise<{ [key: string]: PatientData }> => {
  try {
    // Fetch all documents from the Data collection and use lean() to return plain JavaScript objects
    const documents = await Data.find().lean();

    // Initialize an empty object to store the processed data grouped by signal_type
    const data: { [key: string]: PatientData } = {};

    // Iterate through each document retrieved from the database
    documents.forEach((doc) => {
      const signalType = doc.signal_type; // Extract the signal_type from the document

      if (!data[signalType]) {
        // If no entry for the current signal_type exists, create a new one
        data[signalType] = {
          ...doc, // Use the plain object directly
          data: [...doc.data], // Initialize the data array with the current document's data
        };
      } else {
        // If an entry for the signal_type already exists, merge the current data into it
        data[signalType].data = [...data[signalType].data, ...doc.data];
      }
    });

    // Return the processed data grouped by signal_type
    return data;
  } catch (error) {
    // Log any errors encountered during the database operation
    console.error("Error retrieving decrypted data from MongoDB:", error);
    // Throw an error to indicate the operation failed
    throw new Error("Failed to fetch data from MongoDB");
  }
};


/**
 * Runs the python script responsible for decrypting the patient data.
 *
 * @param {number} [duration=5] The duration of data to decrypt.
 * @param {boolean} [test=false] Whether to run the script in test mode.
 * @param {boolean} [first=false] Whether to run the script in first run mode.
 * @param {string} path The path to the patient file on the CNS monitor.
 *
 * @returns {Promise<void>} A promise that resolves when the python script has finished running successfully,
 *                         or rejects with an error if the script fails to run.
 */
export const runPythonScript = (duration: number = 5, test: boolean = false, first: boolean = false, path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const pythonMainPath = "./decryption/src/main.py"
    let pythonProcess;
    if (test) {
      pythonProcess = spawn("python3", [
        pythonMainPath,
        "-d", duration.toString(),  
        "-t",
        "-p", path
      ]);
    }
    else if (first) {
      pythonProcess = spawn("python3", [
        pythonMainPath,
        "-d", duration.toString(),  
        "-f",
        "-p", path
      ]);
    }
    else {
      pythonProcess = spawn("python3", [
        pythonMainPath,
        "-d", duration.toString(),
        "-p", path 
      ]);
    }

    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};
