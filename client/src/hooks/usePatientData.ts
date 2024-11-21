import {useEffect, useState} from "react";
import { AllDataType, DataType, ProcessedDataType } from "../types/types";
import { fetchPatientData } from "../utils.ts";

// Custom hook to manage the patient data
const usePatientData = () => {
    // Initializes the state for visualizing different measurement data of a patient, only ABP and HR for now
    const [visibleData, setVisibleData] = useState<AllDataType>({
        ["ECG,II"]: { time_vector: [], measurement_data: [] },
        ["ABP,na"]: { time_vector: [], measurement_data: [] },
        ["RESP,na"]: { time_vector: [], measurement_data: [] },
        ["ABP,Dias"]: { time_vector: [], measurement_data: [] },
        ["ABP,Mean"]: { time_vector: [], measurement_data: [] },
        ["ABP,Syst"]: { time_vector: [], measurement_data: [] },
        ["HR,na"]: { time_vector: [], measurement_data: [] },
        ["RR,na"]: { time_vector: [], measurement_data: [] },
        ["SpO2,na"]: { time_vector: [], measurement_data: [] },
        ["Tvesic,na"]: { time_vector: [], measurement_data: [] },
        ["rSO2,Left"]: { time_vector: [], measurement_data: [] },
        ["rSO2,Right"]: { time_vector: [], measurement_data: [] },
    });

    // Initializes the state for checking that data is currently being loaded 
    const [loading, setLoading] = useState(true);
    // Initializes the state for tracking the current index in the dataset
     
    const [currentIndex, setCurrentIndex] = useState<{ [key in keyof AllDataType]?: number }>({});
    const [dataReady, setDataReady] = useState(false); // Flag to track when data is ready 
    // Initializes the state 'fetchedData' with an object consisting of multiple data types of patients
    const [fetchedData, setFetchedData] = useState<AllDataType>({
        ["ECG,II"]: { time_vector: [], measurement_data: [] },
        ["ABP,na"]: { time_vector: [], measurement_data: [] },
        ["RESP,na"]: { time_vector: [], measurement_data: [] },
        ["ABP,Dias"]: { time_vector: [], measurement_data: [] },
        ["ABP,Mean"]: { time_vector: [], measurement_data: [] },
        ["ABP,Syst"]: { time_vector: [], measurement_data: [] },
        ["HR,na"]: { time_vector: [], measurement_data: [] },
        ["RR,na"]: { time_vector: [], measurement_data: [] },
        ["SpO2,na"]: { time_vector: [], measurement_data: [] },
        ["Tvesic,na"]: { time_vector: [], measurement_data: [] },
        ["rSO2,Left"]: { time_vector: [], measurement_data: [] },
        ["rSO2,Right"]: { time_vector: [], measurement_data: [] },
    });

    // Processes fetched data to extract time vectors and measurement data
    const processData = (data: DataType[]) : ProcessedDataType => {
        const time_vector: number[] = [];
        const measurement_data: number[] = [];
        data.reverse().forEach(dataType => {
            // Add timestamps based on sample_interval
            for (let i = 0; i < dataType.samples.length; i++) {
                // Calculate timestamp based on the sample's position
                time_vector.push(dataType.sample_interval * i);
                measurement_data.push(dataType.samples[i]);
            }
        });
        // Calculate the number of samples corresponding to the last 5 seconds
        const sample_interval = data[0]?.sample_interval || 1.024462; // Default to 1.024462 if not available
        const fiveSecondsSamples = Math.ceil(30 / sample_interval); // Samples for the last 30 seconds
        
        // Slice the last 5 seconds of data
        const filtered_time_vector = time_vector.slice(-fiveSecondsSamples);
        const filtered_measurement_data = measurement_data.slice(-fiveSecondsSamples);
        
        return {
            time_vector: filtered_time_vector,
            measurement_data: filtered_measurement_data,
            sample_interval, // Include the sample_interval for reference
        };
    }

    type AllDataKeys = keyof AllDataType; // "ECG,II" | "ABP,Dias" | "ABP,Mean" | ...


    const fetchIntervalTime = 5000; // Time interval for data fetching
    const updateIntervalTime = 1000; // Time interval for data updates
    // const chunkSize = 5; // Number of data points to fetch per update
    // const windowSize = -1000; // Max. number of data points contained in the plot

    // Fetch data at regular intervals
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching new data...");
                const fetchedDataSet = await fetchPatientData(localStorage.getItem("SSN") as string, "data");
                console.log("!!! Fetched data from backend:", fetchedDataSet);

                setFetchedData((prevFetchedData) => {
                    const processedData = {
                        ["ECG,II"]: processData(fetchedDataSet?.["ECG,II"]?.data ?? []),
                        ["ABP,na"]: processData(fetchedDataSet?.["ABP,na"]?.data ?? []),
                        ["RESP,na"]: processData(fetchedDataSet?.["RESP,na"]?.data ?? []),
                        ["ABP,Dias"]: processData(fetchedDataSet?.["ABP,Dias"]?.data ?? []),
                        ["ABP,Mean"]: processData(fetchedDataSet?.["ABP,Mean"]?.data ?? []),
                        ["ABP,Syst"]: processData(fetchedDataSet?.["ABP,Syst"]?.data ?? []),
                        ["HR,na"]: processData(fetchedDataSet?.["HR,na"]?.data ?? []),
                        ["RR,na"]: processData(fetchedDataSet?.["RR,na"]?.data ?? []),
                        ["SpO2,na"]: processData(fetchedDataSet?.["SpO2,na"]?.data ?? []),
                        ["Tvesic,na"]: processData(fetchedDataSet?.["Tvesic,na"]?.data ?? []),
                        ["rSO2,Left"]: processData(fetchedDataSet?.["rSO2,Left"]?.data ?? []),
                        ["rSO2,Right"]: processData(fetchedDataSet?.["rSO2,Right"]?.data ?? []),
                    };

                    const mergedData = { ...prevFetchedData };
                    Object.keys(processedData).forEach((key) => {
                        const dataKey = key as keyof typeof processedData;

                        if (prevFetchedData?.[dataKey]) {
                            const sampleInterval = processedData[dataKey]?.sample_interval || 1.024462;
                            // const maxSamples = Math.ceil(10 / sampleInterval); // Keep the last 10 seconds of data

                            mergedData[dataKey] = {
                                time_vector: [
                                    ...prevFetchedData[dataKey].time_vector,
                                    ...processedData[dataKey].time_vector,
                                ], // Keep only the last 10 seconds
                                measurement_data: [
                                    ...prevFetchedData[dataKey].measurement_data,
                                    ...processedData[dataKey].measurement_data,
                                ], // Keep only the last 10 seconds
                                sample_interval: processedData[dataKey]?.sample_interval,
                            };
                        } else {
                            mergedData[dataKey] = processedData[dataKey];
                        }
                    });
                    console.log("MMMMMMM Updated merged fetched data:", mergedData);
                    return mergedData;
                });

                setDataReady(true);
            } catch (err) {
                console.error("Error in fetching data:", err);
            }
        };

        console.log("Setting fetch interval...");
        const fetchIntervalId = setInterval(fetchData, fetchIntervalTime);

        fetchData(); // Initial fetch on component mount

        return () => {
            console.log("Clearing fetch interval...");
            clearInterval(fetchIntervalId);
        };
    }, [fetchIntervalTime]); // Only depends on fetchIntervalTime
    
    // Update data at regular intervals
    useEffect(() => {
        const updateData = () => {
            if (!dataReady) {
                console.warn("Data not ready yet. Skipping update.");
                return;
            }

            setCurrentIndex((prevIndex) => {
                const nextIndex: { [key in keyof AllDataType]?: number } = { ...prevIndex };

                setVisibleData((prevData) => {
                    const updatedData: AllDataType = { ...prevData };

                    (Object.keys(fetchedData) as AllDataKeys[]).forEach((key) => {
                        const dataType = fetchedData[key];
                        if (!dataType) return;

                        const sampleInterval = dataType?.sample_interval || 1.024462;
                        const totalSamples = dataType.time_vector.length;
                        const prevIdx = prevIndex[key] || 0;
                        const remainingSamples = totalSamples - prevIdx;

                        const dynamicChunkSize = Math.max(
                            1,
                            Math.min(
                                remainingSamples,
                                Math.ceil(updateIntervalTime / (sampleInterval * 1000))
                            )
                        );

                        nextIndex[key] = Math.min(totalSamples, prevIdx + dynamicChunkSize);

                        const maxSamples = Math.ceil(5 / sampleInterval);
                        updatedData[key] = {
                            time_vector: [
                                ...(prevData[key]?.time_vector || []),
                                ...dataType.time_vector.slice(prevIdx, nextIndex[key]),
                            ].slice(-maxSamples),
                            measurement_data: [
                                ...(prevData[key]?.measurement_data || []),
                                ...dataType.measurement_data.slice(prevIdx, nextIndex[key]),
                            ].slice(-maxSamples),
                        };
                    });

                    return updatedData;
                });

                return nextIndex;
            });
        };

        console.log("Setting update interval...");
        const updateIntervalId = setInterval(updateData, updateIntervalTime);

        return () => {
            console.log("Clearing update interval...");
            clearInterval(updateIntervalId);
        };
    }, [updateIntervalTime, fetchedData, dataReady]); // Depends on updateIntervalTime, fetchedData, and dataReady

    useEffect(() => {
        setLoading(false); // Finish loading when component is ready
    }, []);

    return { visibleData, loading };
    };

export default usePatientData;