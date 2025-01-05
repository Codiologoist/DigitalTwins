import api from "./api.ts"; // import axios instance from api.tsx
import { AllDataType } from "./types/types.ts";

// Reusable Function to fetch patient data from the back-end
const fetchPatientData = async (
  patientId: string,
  dataCategory: string,
  isFisrtTime: boolean,
  decryptionTimeout: number,
  isForTesting: boolean,
  path: string
): Promise<AllDataType> => {
  try {
    console.log(`/patients/${patientId}/${dataCategory}?first=${isFisrtTime}&duration=${decryptionTimeout}&test=${isForTesting}&path=${path}`);
    const response = await api.get(`/patients/${patientId}/${dataCategory}?first=${isFisrtTime}&duration=${decryptionTimeout}&test=${isForTesting}&path=${path}`);
    return response.data.data; // Return the data received from the server
  } catch (error) {
    // Log an error message if the request fails
    console.error("Error fetching patient data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Export the fetchPatientData function for use in other files
export { fetchPatientData };
