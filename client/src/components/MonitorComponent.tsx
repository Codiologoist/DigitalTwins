import React from "react";
import '../App.css';
import {FaHeart} from 'react-icons/fa' // Import a heart icon from react-icons
import usePatientData from "../hooks/usePatientData.ts";
import PatientHeader from "./PatientHeaderComponent.tsx";
import PatientSignals from "./PatientSignalsComponent.tsx";
import { Patient } from "../types/types.ts";
import { useParams } from "react-router-dom";

// Sample patient data only for testing purpose - to be removed later
const mockSelectedPatient: Patient = { 
    id: 123, firstName: "David", lastName: "Svensson" 
};

// This function is a mock version,
// which will later be replaced by an API call (retrieve the selected patient's data based on patient's ID)
const useSelectedPatient = (patientId: number | string) => {
    const validPatientId = 123; // Assume only Id 123 is valid in this mock
    if (patientId !== validPatientId) {
        return {
            selectedPatient: null,
            isLoading: false,
            isNotFound: true
        }
    }
    // Simulate the selected patient data
    const selectedPatient = mockSelectedPatient;

    // Simulate a loading state that data(i.e., patient name) is available immediately)
    const isLoading = false;

    // Return the mock patient data and loading state
    return {selectedPatient, isLoading, isNotFound: false};
};

// The main component that renders different rows of data for a patient monitor.
// More specifically, it fetches data (e.g., ABP, heart rate, etc.) and displays them in separate rows using the RowComponent.
const Monitor: React.FC = () => {
    const {visibleData, loading} = usePatientData();
    // const [selectedPatient] = useState<Patient>(mockSelectedPatient); // Simulate that a patient is selected and display their data
    const {patientId} = useParams();
    const {selectedPatient, isLoading: isPatientLoading, isNotFound} = useSelectedPatient(Number(patientId));

    // Shows a loading message until the data has been populated
    if (loading || isPatientLoading) {
        return <div className="text-blue-700">Loading...</div> 
    }
    // Shows a message when patient id is not valid
    if (isNotFound) {
        return <div className="flex items-center justify-center h-screen">
                <div className="bg-blue-100 rounded-lg p-4 shadow-lg max-w-md text-center">
                    <div className="text-blue-700 font-semibold text-lg">
                        No data available for the selected patient.
                    </div>
                    <p className="text-blue-500 mt-2">Please check the patient ID or try again later.</p>
                </div>
               </div>
    }
    // Ensures selectedPatient is not null before rendering PatientHeader
    if (!selectedPatient) {
        return <div className="flex items-center justify-center h-screen">
                <div className="bg-blue-100 rounded-lg p-4 shadow-lg max-w-md text-center">
                    <div className="text-blue-700 font-semibold text-lg">
                        No patient selected
                    </div>
                    <p className="text-blue-500 mt-2">Please check the patient ID or try again later.</p>
                </div>
               </div>
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