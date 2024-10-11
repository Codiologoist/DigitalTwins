import React, { useState } from "react";
import '../App.css';
import {FaHeart} from 'react-icons/fa' // Import a heart icon from react-icons
import usePatientData from "../hooks/usePatientData.ts";
import PatientHeader from "../components/PatientHeader.tsx";
import PatientSignals from "../components/PatientSignals.tsx";
import { Patient } from "../types.ts";

// Sample patient data only for testing purpose - to be removed later
const mockSelectedPatient: Patient = { 
    id: 1, firstName: "David", lastName: "Svensson" 
};

// The main component that renders different rows of data for a patient monitor.
// More specifically, it fetches data (e.g., ABP, heart rate, etc.) and displays them in separate rows using the RowComponent.
const Monitor: React.FC = () => {
    const {visibleData, loading} = usePatientData();
    const [selectedPatient] = useState<Patient>(mockSelectedPatient); // Simulate that a patient is selected and display their data
    // Shows a loading message until the data has been populated
    if (loading) {
        return <div>Loading...</div> 
    }

    // An array of row objects, each representing a row of data type to be displayed.
    const rowData = [
        {title: "HR", unit: "bpm", color: "lightgreen", data: visibleData["HR,na"], optionPart: <FaHeart color="red" />, numberColor: "lightgreen"},
        { title: "RR", unit: "%", color: "green", data: visibleData["RR,na"], numberColor: "green" },
        { title: "ABP", unit: "mmHg", color: "red", data: visibleData["ABP,Dias"], optionPart: "120/80", numberColor: "red" },
        { title: "ABP Mean", unit: "BPM", color: "darkyellow", data: visibleData["ABP,Mean"], numberColor: "darkyellow" },
        { title: "ABP Syst", unit: "Celsius", color: "green", data: visibleData["ABP,Syst"], numberColor: "green" },
        { title: "SpO2", unit: "mmHg", color: "lightblue", data: visibleData["SpO2,na"], numberColor: "lightblue" },
        { title: "Tvesic", unit: "bpm", color: "purple", data: visibleData["Tvesic,na"], numberColor: "green" },
        { title: "rSO2 Left", unit: "", color: "yellow", data: visibleData["rSO2,Left"], numberColor: "yellow" },
        { title: "rSO2 Right", unit: "", color: "yellow", data: visibleData["rSO2,Right"], numberColor: "yellow" },
        // Add more rows if needed
    ]

    return (
        <div className="bg-black">
            {/* Patient Header */}
            <PatientHeader patient={selectedPatient} />
            {/* Grid layout that adjusts dynamically based on the content of the rowData. */}
            <PatientSignals rowData={rowData} />
        </div>
    );
};

export default Monitor;