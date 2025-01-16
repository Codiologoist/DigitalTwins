import { useEffect, useState } from "react";
import { AllDataType, DataType, ProcessedDataType } from "../types/types";
import { fetchPatientData } from "../utils";

// Function to process the received data
const processData = (data: DataType[]): ProcessedDataType => {
  // Arrays to hold time and measurement values
  const time_vector: number[] = [];
  const measurement_data: number[] = [];
  const sample_rates: number[] = []; //<-------------- NEW

  // Since the newest data is on top, we need to reverse the data array
  data.forEach((dataPoint) => {
    // Each data point can contain multiple samples
    dataPoint.samples.forEach((sample) => {
      measurement_data.push(sample);
    });
    dataPoint.timestamps.forEach((timestamp) => {
      time_vector.push(timestamp);
    });
    sample_rates.push(dataPoint.sample_rate); // <------------NEW
  });

  //TODO: Remove sample_interval from data
  const sample_interval = data[0]?.sample_interval || 1.0; // Default to 1 second if not available
  const start_time = data[0]?.start_time;

  return {
    time_vector,
    measurement_data,
    sample_rates, //<----------------NEW
    sample_interval,
    start_time,
  };
};

// Custom hook to manage the patient data
const usePatientData = (
  ssn: string,
  isForTesting: boolean,
  decryptionTimeout: number,
  path: string
) => {
  const [visibleData, setVisibleData] = useState<AllDataType>({
    "ECG,II": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      sample_interval: 0,
      start_time: 0,
    },
    "ABP,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      sample_interval: 0,
      start_time: 0,
    },
    "RESP,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      sample_interval: 0,
      start_time: 0,
    },
    "HR,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      sample_interval: 0,
      start_time: 0,
    },
    "SpO2,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      sample_interval: 0,
      start_time: 0,
    },
  });

  const fetchIntervalTime = 5000; // Fetch data every 5 seconds
  const [isFisrtTime, setIsFisrtTime] = useState(true);

  useEffect(() => {
    if (!ssn) {
      console.warn("No SSN provided; skipping data fetch.");
      return; // Exit if no SSN
    }
    const fetchData = async () => {
      if (isForTesting) {
        setIsFisrtTime(false);
      }
      if (isFisrtTime) {
        try {
          const fetchedDataSet = await fetchPatientData(
            ssn,
            "data",
            isFisrtTime,
            decryptionTimeout,
            isForTesting,
            path
          );
          console.log("from backend fetched everything", fetchedDataSet);
          console.log(
            "from backend fetched RESK.na",
            fetchedDataSet["RESP,na"]?.data
          );
          console.log(
            "from backend fetched ECG",
            fetchedDataSet["ECG,II"]?.data
          );
          const processedData: AllDataType = {
            "ECG,II": processData(fetchedDataSet["ECG,II"]?.data ?? []),
            "ABP,na": processData(fetchedDataSet["ABP,na"]?.data ?? []),
            "RESP,na": processData(fetchedDataSet["RESP,na"]?.data ?? []),
            "HR,na": processData(fetchedDataSet["HR,na"]?.data ?? []),
            "SpO2,na": processData(fetchedDataSet["SpO2,na"]?.data ?? []),
          };
          setIsFisrtTime(false);
          // Update the state with processed data
          setVisibleData(() => processedData);
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      } else {
        try {
          const fetchedDataSet = await fetchPatientData(
            ssn,
            "data",
            isFisrtTime,
            decryptionTimeout,
            isForTesting,
            path
          );
          console.log("from backend fetched everything", fetchedDataSet);
          console.log(
            "from backend fetched RESK.na",
            fetchedDataSet["RESP,na"]?.data
          );
          console.log(
            "from backend fetched ECG",
            fetchedDataSet["ECG,II"]?.data
          );
          const processedData: AllDataType = {
            "ECG,II": processData(fetchedDataSet["ECG,II"]?.data ?? []),
            "ABP,na": processData(fetchedDataSet["ABP,na"]?.data ?? []),
            "RESP,na": processData(fetchedDataSet["RESP,na"]?.data ?? []),
            "HR,na": processData(fetchedDataSet["HR,na"]?.data ?? []),
            "SpO2,na": processData(fetchedDataSet["SpO2,na"]?.data ?? []),
          };
          setIsFisrtTime(false);
          // Update the state with processed data
          setVisibleData(() => processedData);
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, fetchIntervalTime);

    return () => clearInterval(intervalId);
  }, [ssn, isForTesting, decryptionTimeout, isFisrtTime, path]);
  return { visibleData };
};

export default usePatientData;
