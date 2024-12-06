import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Patient } from "../types/types.ts";
import DataTrendModal from "./DataTrendModal";
import api from "../api";
import { ChartData } from 'chart.js';

// Define the interface for the props of the PatientHeader component
interface PatientHeaderProps {
    patient: Patient; // Patient object to be passed as a prop
}

// The PatientHeader component
const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    // Define state variables
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [data, setData] = useState<ChartData<'line'> | string | null>(null); // Store chart data or error message
    const [loading, setLoading] = useState(false); // Track loading state (true if data is loading)
    const [error, setError] = useState<string | null>(null); // Store any error message
    const SSN = localStorage.getItem('SSN'); // Retrieve SSN from local storage
    const [timePoint, setTimePoint] = useState(1); // State to store selected time point in minutes
    const [selectedTimeInterval, setSelectedTimeInterval] = useState(60);
    const [maxTimePoint, setMaxTimePoint] = useState(60);

    // Method to fetch and display data trend for the selected category at the selected time point
    const showDataTrend = async (category: string, timePoint: number) => {
        setIsModalOpen(true); // Open the modal
        setLoading(true); // Set loading state to true
        setError(null); // Clear any existing errors

        try {
            // Fetch data from the API
            const response = await api.get(`/patients/${SSN}/data/${category}`);
            const fetchedData = response.data.data; // Get the data part of the response
            const dataArray = fetchedData?.data; // Extract the data array
            const sampleFrequency = 500;
            
            if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
                const ecgSignal = dataArray[0]; // For now, use the first signal in the data array
                let timestamps = ecgSignal.timestamps; // ECG timestamps
                let samples = ecgSignal.samples; // ECG sample values
                console.log('Timestamps length:', timestamps.length);
                console.log('Samples length:', samples.length);
                console.log('start_time:', ecgSignal.start_time);
                
                const startTime = new Date(ecgSignal.start_time / 1000); // Convert start_time to a millisecond timestamp
                timestamps = timestamps.map((ts: number) => {
                    const date = new Date(startTime.getTime() + ts * 1000); // Calculate the time according to start_time and ts
                    return date.toLocaleTimeString("en-US", { hour12: false }); // Format timestamp to HH:MM:SS
                });

                // Divide data range
                let dataRange = selectedTimeInterval * sampleFrequency; // Divide data range for one-minute data
                if (timestamps.length < dataRange) {
                    dataRange =  timestamps.length;
                }
                const startIndex = Math.max(timestamps.length - timePoint * dataRange, 0);
                const endIndex = timestamps.length - (timePoint - 1) * dataRange;
                setMaxTimePoint(Math.ceil(timestamps.length / dataRange));
                console.log("MaxTimePoint", Math.ceil(timestamps.length / dataRange));
                timestamps = timestamps.slice(startIndex, endIndex);
                samples = samples.slice(startIndex, endIndex); // Slice range for samples

                // Limit the range of the sample values for the Y-axis
                const minValue = -1.5; 
                const maxValue = 1.5;
                samples = samples.map((sample: number) => Math.min(Math.max(sample, minValue), maxValue)); // Clamp values

                // Prepare the chart data object
                const chartData = {
                    labels: timestamps, // Timestamps for X-axis labels
                    datasets: [
                        {
                            label: "ECG Signal", // Label for the ECG dataset
                            data: samples, // ECG signal values for the Y-axis
                            borderColor: "rgb(75, 192, 192)", // Color of the line
                            tension: 0.1, // Line smoothing
                        },
                    ],
                };

                setData(chartData); // Set the prepared chart data
            } else {
                setData("No data available."); // No data case
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error:", error.message); // Log the error message if an error occurs
            } else {
                console.error("Unexpected error:", error); // Log any other errors
            }
        } finally {
            setLoading(false); // Set loading state to false once data is fetched
        }
    };

    // Method to close the modal
    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setData(null); // Clear any existing data
        setError(null); // Clear any existing errors
    };


    // Method to handle Look Up (go forward 1 minute)
    const lookUp = async () => {
        setTimePoint((prevTimePoint) => {
            let newTimePoint = prevTimePoint + 1; // Increment timePoint
            if(newTimePoint > maxTimePoint){
                newTimePoint = maxTimePoint;
            }
            showDataTrend("ECG,II,Merged", newTimePoint); // Trigger data reload for new timePoint
            return newTimePoint;
        });
    };

    // Method to handle Look Down (go back 1 minute)
    const lookDown = async () => {
        setTimePoint((prevTimePoint) => {
            const newTimePoint = Math.max(prevTimePoint - 1, 1); // Ensure the timePoint doesn't go below 1 minute
            showDataTrend("ECG,II,Merged", newTimePoint); // Trigger data reload for new timePoint
            return newTimePoint;
        });
    };


    return (
        <div className="text-lg p-4 pt-20 flex items-center space-x-2 text-white shadow-lg rounded-lg border-2 border-gray-900">
            <FaUser/> {/* Display user icon */}
            <h1 className="font-bold ">
                Patient:  {patient.firstName} {patient.lastName} {/* Display patient name */}
            </h1>

            <h1 className="hidden lg:block px-20">|</h1>
            
            <div className="flex items-center space-x-2 w-full lg:w-auto">
                <h1 className="font-bold pr-5">Previous Data View:</h1> {/* Label for Data Trend section */}
                
                <div className="flex space-x-5 flex-wrap">

                    {/* Input field to enter the time point in minutes */}
                    <div className="flex items-center space-x-1 mr-10">
                        <input
                            type="number"
                            className="bg-black text-white border border-lightgray rounded-md px-2 w-20 focus:outline-none focus:ring-2"
                            aria-label="Enter time point in minutes"
                            placeholder="Minutes"
                            value={timePoint} // Display time point in minutes
                            min="1" // Prevent values less than 1
                            onChange={(e) => {
                                const inputValue = Number(e.target.value);
                                if (inputValue > 0) {
                                    if(inputValue > maxTimePoint){
                                        setTimePoint(maxTimePoint);
                                    }else{
                                        setTimePoint(inputValue); // Set the timePoint in minutes
                                    }
                                } else {
                                    setTimePoint(1); // Default to 1 minute if invalid
                                }
                            }}
                        />
                        <select
                            className="bg-black text-white border border-lightgray rounded-md px-2 w-24 focus:outline-none focus:ring-2 ml-4"
                            aria-label="Select time interval"
                            onChange={(e) => {
                                const newInterval = Number(e.target.value);
                                setSelectedTimeInterval(newInterval);
                                setMaxTimePoint(60);
                            }}
                        >I
                            <option value={60}>min</option>
                            <option value={10}>10s</option>
                        </select>
                        <span className="text-white"> ago </span>
                    </div>
                    
                    {/* Buttons to trigger fetching different categories of data */}
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("ECG,II,Merged", timePoint)}>ECG</button>
                </div>
            </div>

            {/* Modal to display data trend */}
            <DataTrendModal
                isOpen={isModalOpen} // Pass the modal visibility state
                onClose={closeModal} // Pass close modal function
                loading={loading} // Pass loading state
                data={data} // Pass data (chart data or error message)
                error={error} // Pass error message
                timeRange={60} // Pass timePoint for chart configuration
                lookUp={lookUp} // Pass LookUp function
                lookDown={lookDown} // Pass LookDown function
            />
        </div>
    );
};

export default PatientHeader;
