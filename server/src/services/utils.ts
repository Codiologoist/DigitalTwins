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
