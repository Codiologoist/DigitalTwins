import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Patient } from "../types/types.ts";
import DataTrendModal from "./DataTrendModal";

interface PatientHeaderProps {
    patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({patient}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showDataTrend = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                    <button type="button" className="data_trend-button" onClick={showDataTrend}>ECG</button>
                    <button type="button" className="data_trend-button" onClick={showDataTrend}>ABP</button>
                    <button type="button" className="data_trend-button" onClick={showDataTrend}>RESP</button>
                </div>
            </div>

            <DataTrendModal isOpen={isModalOpen} onClose={closeModal} />

        </div>
    )
}

export default PatientHeader;