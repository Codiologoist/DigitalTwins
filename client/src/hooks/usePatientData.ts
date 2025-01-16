import { useEffect, useState } from "react";
import { AllDataType, DataType, ProcessedDataType } from "../types/types";
import { fetchPatientData } from "../utils";

// Function to process the received data
const processData = (data: DataType[]): ProcessedDataType => {
  // Arrays to hold time, measurement values, and sample_rates
  const time_vector: number[] = []; // Array to store all timestamp values from the data 
  const measurement_data: number[] = []; // Array to store all measurement values from the data
  const sample_rates: number[] = []; // Array to store the sample rate 

  const start_time = data[0]?.start_time; // Retrieve the start time from the first data point, if available
  // Iterate through each data point in the input array to extract and organize data
  // As each data point contains multiple samples, timestamps, and a sample rate, which are flattened into separate arrays for easy processing.
  data.forEach((dataPoint) => {
    // Each data point can contain multiple samples, iterate through each sample
    dataPoint.samples.forEach((sample) => {
      measurement_data.push(sample); // Add each sample value to the measurement_data array
    });
    // Add each timestamp value to the time_vector array
    dataPoint.timestamps.forEach((timestamp) => {
      time_vector.push(timestamp);
    });
    // Add the sample rate of the current data point to the sample_rates array 
    sample_rates.push(dataPoint.sample_rate); 
  });
  
  // Return an object containing the processed data arrays and variable
  return {
    time_vector, // All timestamp values in chronological order
    measurement_data, // All measurement values (samples)
    sample_rates, // All sample rates
    start_time, // The start time of the data
  };
};

// Custom hook to manage the patient data
const usePatientData = (
  ssn: string, // Identifier for the patient
  isForTesting: boolean, // Flag to indicate whether the hook is used in testing mode
  decryptionTimeout: number, // Timeout duration for decryption processes
  path: string // File path for each specific patient
) => {
  // State to store the processed patient data for various signals
  const [visibleData, setVisibleData] = useState<AllDataType>({
    "ECG,II": {
      time_vector: [], // Array for timestamps of ECG data
      measurement_data: [], // Array for measurement values of ECG data
      sample_rates: [], // Array for sample rates of ECG data
      start_time: 0, // Start time of ECG data
    },
    "ABP,na": {
      time_vector: [],  // Array for timestamps of ABP data
      measurement_data: [], // Array for measurement values of ABP data
      sample_rates: [], // Array for sample rates of ABP data
      start_time: 0, // Start time of ABP data
    },
    "RESP,na": {
      time_vector: [], // Array for timestamps of RESP data
      measurement_data: [], // Array for measurement values of RESP data
      sample_rates: [], // Array for sample rates of RESP data
      start_time: 0, // Start time of RESP data
    },
    "HR,na": {
      time_vector: [], // Array for timestamps of HR data
      measurement_data: [], // Array for measurement values of HR data
      sample_rates: [], // Array for sample rates of HR data
      start_time: 0, // Start time of HR data
    },
    "SpO2,na": {
      time_vector: [], // Array for timestamps of SpO2 data
      measurement_data: [], // Array for measurement values of SpO2 data
      sample_rates: [], // Array for sample rates of SpO2 data
      start_time: 0, // Start time of SpO2 data
    },
    "RR,na": {
      time_vector: [], // Array for timestamps of RR data
      measurement_data: [], // Array for measurement values of RR data
      sample_rates: [], // Array for sample rates of RR data
      start_time: 0, // Start time of RR data
    },
    "PLETH,na": {
      time_vector: [], // Array for timestamps of PLETH data
      measurement_data: [], // Array for measurement values of PLETH data
      sample_rates: [], // Array for sample rates of PLETH data
      start_time: 0, // Start time of PLETH data
    },
  });

  const fetchIntervalTime = 5000; // Fetch data every 5 seconds
  const [isFisrtTime, setIsFisrtTime] = useState(true); // State to track if it's the first data fetch

  // useEffect hook to manage fetching and updating patient data
  useEffect(() => {
    // Log a warning if no SSN is provided
    if (!ssn) {
      console.warn("No SSN provided; skipping data fetch."); 
      return; // Exit if no SSN
    }
    // Function to fetch and process patient data
    const fetchData = async () => {
      if (isForTesting) {
        setIsFisrtTime(false); // Skip first-time logic for testing
      }
      if (isFisrtTime) {
        // Handle first-time data fetch
        try {
          const fetchedDataSet = await fetchPatientData(
            ssn, // Patient identifier
            "data", // Type of data to fetch
            isFisrtTime, // Indicates it's the first fetch
            decryptionTimeout, // Timeout for decryption
            isForTesting, // Testing flag
            path // Patient file path
          );
          // Process and organize the fetched data for various signals
          const processedData: AllDataType = {
            "ECG,II": processData(fetchedDataSet["ECG,II"]?.data ?? []),
            "ABP,na": processData(fetchedDataSet["ABP,na"]?.data ?? []),
            "RESP,na": processData(fetchedDataSet["RESP,na"]?.data ?? []),
            "HR,na": processData(fetchedDataSet["HR,na"]?.data ?? []),
            "SpO2,na": processData(fetchedDataSet["SpO2,na"]?.data ?? []),
            "RR,na": processData(fetchedDataSet["RR,na"]?.data ?? []),
            "PLETH,na": processData(fetchedDataSet["PLETH,na"]?.data ?? []),
          };
          setIsFisrtTime(false); // Mark as not the first time after successful fetch
          setVisibleData(() => processedData); // Update the state with processed data
        } catch (err) {
          console.error("Error fetching patient data:", err); // Log errors if fetch fails
        }
      } else {
        // Handle subsequent data fetches
        try {
          const fetchedDataSet = await fetchPatientData(
            ssn, // Patient identifier
            "data", // Type of data to fetch
            isFisrtTime, // Indicates it's the first fetch
            decryptionTimeout, // Timeout for decryption
            isForTesting, // Testing flag
            path // Patient file path
          );
          console.log("From backend fetched data:", fetchedDataSet);
          // Process and organize the fetched data for various signals
          const processedData: AllDataType = {
            "ECG,II": processData(fetchedDataSet["ECG,II"]?.data ?? []),
            "ABP,na": processData(fetchedDataSet["ABP,na"]?.data ?? []),
            "RESP,na": processData(fetchedDataSet["RESP,na"]?.data ?? []),
            "HR,na": processData(fetchedDataSet["HR,na"]?.data ?? []),
            "SpO2,na": processData(fetchedDataSet["SpO2,na"]?.data ?? []),
            "RR,na": processData(fetchedDataSet["RR,na"]?.data ?? []),
            "PLETH,na": processData(fetchedDataSet["PLETH,na"]?.data ?? []),
          };
          setIsFisrtTime(false); // Mark as not the first time after successful fetch
          setVisibleData(() => processedData); // Update the state with processed data
        } catch (err) {
          console.error("Error fetching patient data:", err); // Log errors if fetch fails
        }
      }
    };

    fetchData(); // Initial data fetch
    const intervalId = setInterval(fetchData, fetchIntervalTime); // Set up periodic fetching

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [ssn, isForTesting, decryptionTimeout, isFisrtTime, path]); // Dependencies for the useEffect
  return { visibleData }; // Return processed data to the component using the hook
};

export default usePatientData;
