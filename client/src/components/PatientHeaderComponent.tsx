import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Patient } from "../types/types.ts";
import DataTrendModal from "./DataTrendModal";
import api from "../api";
import { ChartData } from 'chart.js';

interface PatientHeaderProps {
    patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<ChartData<'line'> | string | null>(null);
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState<string | null>(null); // Store any error message
    const SSN = localStorage.getItem('SSN');
  
    // Method to show data trend modal and fetch data
    const showDataTrend = async (category: string) => {
      setIsModalOpen(true);
      setLoading(true);
      setError(null);
  
      try {
        const response = await api.get(`/patients/${SSN}/data/${category}`);
        const fetchedData = response.data?.data;
        
        if (fetchedData && Array.isArray(fetchedData)) {
            const ecgSignal = fetchedData[0]; // You could also loop through and handle multiple signals
            const timestamps = ecgSignal.timestamps;
            const samples = ecgSignal.samples;
      
            // Prepare data for chart
            const chartData = {
              labels: timestamps, // Timestamps as X-axis
              datasets: [
                {
                  label: "ECG Signal",
                  data: samples, // ECG signal values as Y-axis
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            };
            
            setData(chartData);
        } else {
            setData("No data available.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Method to close the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setData(null); // Clear data
      setError(null); // Clear error
    };

    return (
        <div className="text-lg p-4 pt-20 flex items-center space-x-2 text-white shadow-lg rounded-lg border-2 border-gray-900">
            <FaUser/>
            <h1 className="font-bold ">
                Patient:  {patient.firstName} {patient.lastName}
            </h1>

            <h1 className="hidden lg:block px-20">|</h1>
            
            <div className="flex items-center space-x-2 w-full lg:w-auto">
                <h1 className="font-bold pr-5">Data Trend:</h1>
                
                <div className="flex space-x-5 flex-wrap">
                    <select
                        className="bg-black text-white border border-lightgray rounded-md px-3 focus:outline-none focus:ring-2"
                        aria-label="Select time range"
                    >
                        <option value="10m">Last 1 Min</option>
                        <option value="30m">Last 30 Mins</option>
                        <option value="1h">Last 1 Hour</option>
                        <option value="12h">Last 12 Hours</option>
                    </select>
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("ECG,II")}>ECG</button>
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("abp")}>ABP</button>
                    <button type="button" className="data_trend-button" onClick={() => showDataTrend("resp")}>RESP</button>
                </div>
            </div>

            <DataTrendModal
                isOpen={isModalOpen}
                onClose={closeModal}
                loading={loading}
                data={data}
                error={error}
            />

        </div>
    )
}

export default PatientHeader;