import api from "./api.ts"; // import axios instance from api.tsx
import { AllDataType } from "./types/types.ts";

// Reusable Function to fetch patient data from the back-end
const fetchPatientData = async (
  patientId: string,
  dataCategory: string
): Promise<AllDataType> => {
  try {
    const response = await api.get(`/patients/${patientId}/${dataCategory}`);
    return response.data.data; // Return the data received from the server
    console.log("Data received from the backend:", response.data); // Log received data
  } catch (error) {
    // Log an error message if the request fails
    console.error("Error fetching patient data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Export the fetchPatientData function for use in other files
export { fetchPatientData };
