import React, { useState } from "react"; // Import React and useState hook
import { FaUser } from "react-icons/fa"; // Import FaUser icon from react-icons
import { Patient } from "../types/types.ts"; // Import the Patient type
import DataTrendModal from "./DataTrendModal"; // Import DataTrendModal component
import api from "../api"; // Import the API instance for making API requests
import { ChartData } from 'chart.js'; // Import the ChartData type for chart data

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
    const [timeRange, setTimeRange] = useState(60); // State to store selected time range in seconds

    // Method to fetch and display data trend for the selected category
    const showDataTrend = async (category: string) => {
        setIsModalOpen(true); // Open the modal
        setLoading(true); // Set loading state to true
        setError(null); // Clear any existing errors

        try {
            // Fetch data from the API
            const response = await api.get(`/patients/${SSN}/data/${category}`);
            const fetchedData = response.data.data; // Get the data part of the response
            const dataArray = fetchedData?.data; // Extract the data array
            
            if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
                const ecgSignal = dataArray[0]; // For now, use the first signal in the data array
                let timestamps = ecgSignal.timestamps; // ECG timestamps
                let samples = ecgSignal.samples; // ECG sample values
                
                // Convert timestamps to human-readable time format
                const baseTime = new Date(); 
                const startTime = new Date(baseTime.getTime() - timeRange * 1000); // Calculate start time based on timeRange
                timestamps = timestamps.map((ts: number) => {
                    const date = new Date(startTime.getTime() + ts * 1000); // Convert timestamp to date object
                    return date.toLocaleTimeString("en-US", { hour12: false }); // Format timestamp to HH:MM:SS
                });

                // Limit the number of data points displayed on the chart
                const maxDataPoints = timeRange * 500; // Limit by timeRange and factor to adjust data density
                if (timestamps.length > maxDataPoints) {
                    timestamps = timestamps.slice(0, maxDataPoints); // Slice to limit data points
                    samples = samples.slice(0, maxDataPoints); // Slice corresponding sample data
                }

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

    return (
        <div className="text-lg p-4 pt-20 flex items-center space-x-2 text-white shadow-lg rounded-lg border-2 border-gray-900">
            <FaUser/> {/* Display user icon */}
            <h1 className="font-bold ">
                Patient:  {patient.firstName} {patient.lastName} {/* Display patient name */}
            </h1>

            <h1 className="hidden lg:block px-20">|</h1>
            
            <div className="flex items-center space-x-2 w-full lg:w-auto">
                <h1 className="font-bold pr-5">Data Trend:</h1> {/* Label for Data Trend section */}
                
                <div className="flex space-x-5 flex-wrap">
                    {/* Dropdown to select the time range */}
                    <select
                        className="bg-black text-white border border-lightgray rounded-md px-3 focus:outline-none focus:ring-2"
                        aria-label="Select time range"
                        value={timeRange} // Set value from state
                        onChange={(e) => setTimeRange(Number(e.target.value))} // Update state when value changes
                    >
                        <option value={60}>Last 1 Min</option>
                        <option value={600}>Last 10 Mins</option>
                        <option value={1800}>Last 30 Mins</option>
                        <option value={3600}>Last 1 Hour</option>
                    </select>
                    {/* Buttons to trigger fetching different categories of data */}
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("ECG,II")}>ECG</button>
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("abp")}>ABP</button>
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("resp")}>RESP</button>
                </div>
            </div>

            {/* Modal to display data trend */}
            <DataTrendModal
                isOpen={isModalOpen} // Pass the modal visibility state
                onClose={closeModal} // Pass close modal function
                loading={loading} // Pass loading state
                data={data} // Pass data (chart data or error message)
                error={error} // Pass error message
                timeRange={timeRange} // Pass timeRange for chart configuration
            />
        </div>
    );
};

export default PatientHeader;
