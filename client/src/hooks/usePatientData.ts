import {useEffect, useState} from "react";
import { AllDataType } from "../types/types.ts";
import { fetchPatientData } from "../utils.ts";

// Custom hook to manage the patient data
const usePatientData = () => {
    // Initializes the state for visualizing different measurement data of a patient, only ABP and HR for now
    const [visibleData, setVisibleData] = useState<AllDataType>({
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setCurrentIndex] = useState(0);  
    // Initializes the state 'fetchedData' with an object consisting of multiple data types of patients
    const [fetchedData, setFetchedData] = useState<AllDataType>({
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

    const fetchIntervalTime = 5000; // Time interval for data fetching
    const updateIntervalTime = 200; // Time interval for data updates
    const chunkSize = 5; // Number of data points to fetch per update
    const windowSize = -1000; // Max. number of data points contained in the plot

    useEffect(() => {
        // Fetch data every 10 seconds
        const fetchData = async() => {
            try {
                const fetchedDataSet = await fetchPatientData(localStorage.getItem("SSN") as string, "data");
                console.log("fetched data from backend:", fetchedDataSet);
                setFetchedData({
                    ["ABP,Dias"]: {
                        time_vector: fetchedDataSet['ABP,Dias'].time_vector.flat(),
                        measurement_data: fetchedDataSet['ABP,Dias'].measurement_data.flat(),
                    },
                    ["ABP,Mean"]: {
                        time_vector: fetchedDataSet['ABP,Mean'].time_vector.flat(),
                        measurement_data: fetchedDataSet['ABP,Mean'].measurement_data.flat(),
                    },
                    ["ABP,Syst"]:  {
                        time_vector: fetchedDataSet['ABP,Syst'].time_vector.flat(),
                        measurement_data: fetchedDataSet['ABP,Syst'].measurement_data.flat(),
                    }, 
                    ["HR,na"]: {
                        time_vector: fetchedDataSet['HR,na'].time_vector.flat(),
                        measurement_data: fetchedDataSet['HR,na'].measurement_data.flat(),
                    },
                    ["RR,na"]: {
                        time_vector: fetchedDataSet['RR,na'].time_vector.flat(),
                        measurement_data: fetchedDataSet['RR,na'].measurement_data.flat(),
                    },
                    ["SpO2,na"]: { 
                        time_vector: fetchedDataSet['SpO2,na'].time_vector.flat(), 
                        measurement_data: fetchedDataSet['SpO2,na'].measurement_data.flat(), 
                    },
                    ["Tvesic,na"]: { 
                        time_vector: fetchedDataSet['Tvesic,na'].time_vector.flat(), 
                        measurement_data: fetchedDataSet['Tvesic,na'].measurement_data.flat(), 
                    },
                    ["rSO2,Left"]: { 
                        time_vector: fetchedDataSet['rSO2,Left'].time_vector.flat(), 
                        measurement_data: fetchedDataSet['rSO2,Left'].measurement_data.flat(), 
                    },
                    ["rSO2,Right"]: { 
                        time_vector: fetchedDataSet['rSO2,Right'].time_vector.flat(), 
                        measurement_data: fetchedDataSet['rSO2,Right'].measurement_data.flat(), 
                    },
                
                })
            } catch (err) {
                console.error("Error in fetching data: ", err);
            }
        }

        // Updates the visibleData
        const updateData = () => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + chunkSize;

                setVisibleData((prevData) => {
                    // Returns the updated state for visibleData and only shows the last 200 data points
                    // to simulate a sliding effect
                    return {
                        // Concatenates the existing data type's time and measurement data with the new data chunk, then only limits to the last 200 points.
                        ["ABP,Dias"]: {
                            time_vector: [...prevData['ABP,Dias'].time_vector, ...fetchedData['ABP,Dias'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['ABP,Dias'].measurement_data, ...fetchedData['ABP,Dias'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["ABP,Mean"]: {
                            time_vector: [...prevData['ABP,Mean'].time_vector, ...fetchedData['ABP,Mean'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['ABP,Mean'].measurement_data, ...fetchedData['ABP,Mean'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["ABP,Syst"]: {
                            time_vector: [...prevData['ABP,Syst'].time_vector, ...fetchedData['ABP,Syst'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['ABP,Syst'].measurement_data, ...fetchedData['ABP,Syst'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["HR,na"]: {
                            time_vector: [...prevData['HR,na'].time_vector, ...fetchedData['HR,na'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['HR,na'].measurement_data, ...fetchedData['HR,na'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["RR,na"]: {
                            time_vector: [...prevData['RR,na'].time_vector, ...fetchedData['RR,na'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['RR,na'].measurement_data, ...fetchedData['RR,na'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["SpO2,na"]: {
                            time_vector: [...prevData['SpO2,na'].time_vector, ...fetchedData['SpO2,na'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['SpO2,na'].measurement_data, ...fetchedData['SpO2,na'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["Tvesic,na"]: {
                            time_vector: [...prevData['Tvesic,na'].time_vector, ...fetchedData['Tvesic,na'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['Tvesic,na'].measurement_data, ...fetchedData['Tvesic,na'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["rSO2,Left"]: {
                            time_vector: [...prevData['rSO2,Left'].time_vector, ...fetchedData['rSO2,Left'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['rSO2,Left'].measurement_data, ...fetchedData['rSO2,Left'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        },
                        ["rSO2,Right"]: {
                            time_vector: [...prevData['rSO2,Right'].time_vector, ...fetchedData['rSO2,Right'].time_vector.slice(prevIndex, nextIndex)].slice(windowSize),
                            measurement_data: [...prevData['rSO2,Right'].measurement_data, ...fetchedData['rSO2,Right'].measurement_data.slice(prevIndex, nextIndex)].slice(windowSize)
                        }
                    }
                });
                return nextIndex; // Updates currentIndex to the next index                            
                }
            )};
        
        const fetchIntervalId = setInterval(fetchData, fetchIntervalTime); // Set an interval to fetch the data
        const updateIntervalId = setInterval(updateData, updateIntervalTime); // // Set an interval to update the data

        setLoading(false) ; // Finish loading data
        return () => {
            // Clean up the interval
            clearInterval(fetchIntervalId); 
            clearInterval(updateIntervalId);
        }
    }, [fetchedData])
    return {visibleData, loading};
}

export default usePatientData;