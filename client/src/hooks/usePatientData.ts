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
  const start_time = data[0]?.start_time || 1602850182520965; // Initialize start_time to some random time if not available

  return {
    time_vector,
    measurement_data,
    sample_rates, //<----------------NEW
    sample_interval,
    start_time,
  };
};

// Custom hook to manage the patient data
const usePatientData = () => {
  const [visibleData, setVisibleData] = useState<AllDataType>({
    ["ECG,II"]: { time_vector: [], measurement_data: [] },
    ["ABP,na"]: { time_vector: [], measurement_data: [] },
    ["RESP,na"]: { time_vector: [], measurement_data: [] },
  });

  const fetchIntervalTime = 5000; // Fetch data every 5 seconds

  //TODO: RE-DO THIS PART, only send new data, don't save anything etc.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDataSet = await fetchPatientData(
          localStorage.getItem("SSN") as string,
          "data"
        );
        console.log("from backend fetched", fetchedDataSet["ECG,II"]?.data);
        const processedData = {
          ["ECG,II"]: processData(fetchedDataSet?.["ECG,II"]?.data ?? []),
          ["ABP,na"]: processData(fetchedDataSet?.["ABP,na"]?.data ?? []),
          ["RESP,na"]: processData(fetchedDataSet?.["RESP,na"]?.data ?? []),
        };

        // Update this part to add sample_interval in usePatientData hook
        setVisibleData((prevVisibleData) => {
          const updatedVisibleData = { ...prevVisibleData };

          Object.keys(processedData).forEach((key) => {
            const dataKey = key as keyof typeof processedData;

            const newTimeVector = processedData[dataKey]?.time_vector || [];
            const newMeasurementData =
              processedData[dataKey]?.measurement_data || [];
            const sampleInterval =
              processedData[dataKey]?.sample_interval || 1.024462; // Ensure sample_interval is used
            const newStartTime = processedData[dataKey]?.start_time;

            // console.log(`Start time for ${dataKey} has changed! Previous: ${prevVisibleData[dataKey]?.start_time}, New: ${newStartTime}`);

            const prevTimeVector = prevVisibleData[dataKey]?.time_vector || [];
            const prevStartTime = prevVisibleData[dataKey]?.start_time;

            // Calculate absolute times for comparison
            if (prevTimeVector.length > 0 && newTimeVector.length > 0) {
              const lastPreviousTime =
                prevTimeVector[prevTimeVector.length - 1];
              const absoluteLastPreviousTime = prevStartTime + lastPreviousTime; // Absolute last time from previous data

              const firstNewTime = newTimeVector[0];
              const absoluteFirstNewTime = newStartTime + firstNewTime; // Absolute first time from new data

              // Ensure continuity between previous and new time data
              if (absoluteFirstNewTime <= absoluteLastPreviousTime) {
                console.warn(
                  `Discontinuity detected for ${dataKey}! Last previous absolute time: ${absoluteLastPreviousTime}, First new absolute time: ${absoluteFirstNewTime}`
                );
              } else {
                console.log(
                  `Data for ${dataKey} is continuous. Last previous absolute time: ${absoluteLastPreviousTime}, First new absolute time: ${absoluteFirstNewTime}`
                );
              }
            }

            // Append new data and ensure we keep only the last 30 seconds of data
            const maxSamples = Math.ceil(30 / sampleInterval);

            updatedVisibleData[dataKey] = {
              time_vector: [
                ...prevVisibleData[dataKey].time_vector,
                ...newTimeVector,
              ].slice(-maxSamples),
              measurement_data: [
                ...prevVisibleData[dataKey].measurement_data,
                ...newMeasurementData,
              ].slice(-maxSamples),
              sample_interval: sampleInterval, // Include sample_interval in the updated object
              start_time: newStartTime,
            };
          });

          return updatedVisibleData;
        });
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, fetchIntervalTime);

    return () => clearInterval(intervalId);
  }, []);
  return { visibleData };
};

export default usePatientData;
