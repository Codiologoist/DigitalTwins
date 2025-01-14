import React, { useEffect, useState } from "react";
import '../App.css';
// import {FaHeart} from 'react-icons/fa' // Import a heart icon from react-icons
import usePatientData from "../hooks/usePatientData.ts";
import PatientHeader from "./PatientHeaderComponent.tsx";
import PatientSignals from "./PatientSignalsComponent.tsx";
import { AllDataType, Patient, RowData } from "../types/types.ts";
import { useParams } from "react-router-dom";
import Api from "../api.ts";

interface response {
    data: Patient
    success: boolean
    message: string
}

// Fetch patient based on SSN
const fetchSelectedPatient = async (patientId: number | string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found. User needs to log in.");
        return {
          selectedPatient: null,
          isLoading: false,
          isNotFound: true,
        };
    }

    try  {
        const response = await Api.get<response>(`patients/${patientId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const patient = response.data.data;
        return {
            selectedPatient: patient,
            isLoading: false,
            isNotFound: false
        }
    } catch (error) {
        console.error("Error fetching patient data:", error);
        return {
            selectedPatient: null,
            isLoading: false,
            isNotFound: true
        }
    }
};

// The main component that renders different rows of data for a patient monitor.
// More specifically, it fetches data (e.g., ABP, heart rate, etc.) and displays them in separate rows using the RowComponent.
const Monitor: React.FC = () => {
    let visibleData: AllDataType = {
        "ECG,II": { time_vector: [], measurement_data: [], sample_rates: [], sample_interval:0,  start_time: 0},
        "ABP,na": { time_vector: [], measurement_data: [], sample_rates: [], sample_interval:0,  start_time: 0 },
        "RESP,na": { time_vector: [], measurement_data: [], sample_rates: [], sample_interval:0,  start_time: 0 },
        "HR,na": { time_vector: [], measurement_data: [], sample_rates: [], sample_interval:0,  start_time: 0 },
    };
    const { patientId } = useParams();

    const [patientState, setPatientState] = useState<{
        selectedPatient: Patient | null;
        isLoading: boolean;
        isNotFound: boolean;
    }>({
        selectedPatient: null,
        isLoading: true,
        isNotFound: false,
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetchSelectedPatient(String(patientId));
                setPatientState({
                    selectedPatient: response.selectedPatient,
                    isLoading: response.isLoading,
                    isNotFound: response.isNotFound,
                });
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatientState({
                    selectedPatient: null,
                    isLoading: false,
                    isNotFound: true,
                });
            }
        };

        fetchPatient();
    }, [patientId]);

    const ssn = patientState.selectedPatient?.SSN || "";
    const path = patientState.selectedPatient?.path || "";

    visibleData = usePatientData(ssn, true, 5, path).visibleData;

    // Destructure state
    const { selectedPatient, isLoading: isPatientLoading, isNotFound } = patientState;

    // Shows a loading message until the data has been populated
    if (isPatientLoading) {
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
    const rowData: RowData[] = [
        // {title: "ECG", unit: "mV", color: "lightgreen", data: visibleData["ECG,II"], optionPart: <FaHeart color="red" />, numberColor: "lightgreen"},
        {title: "ECG", unit: "mV", color: "lightgreen", 
            data: {
                ...visibleData["ECG,II"], start_time: visibleData["ECG,II"]?.start_time ?? 0 // Default to 0 if undefined
            }, 
            numberColor: "lightgreen", 
            valueDisplayData: {
                ...visibleData["HR,na"],
                start_time: visibleData["HR,na"]?.start_time ?? 0 // Default to 0 if undefined
            }, 
            valueDisplayTitle: "HR", valueDisplayUnit: "bpm"},
        {title: "ABP,na", unit: "mmHg", color: "lightgreen", data: {
            ...visibleData["ABP,na"], start_time: visibleData["ABP,na"]?.start_time ?? 0 // Default to 0 if undefined
        },  numberColor: "lightgreen"},
        {title: "RESP,na", unit: "Ohms", color: "lightgreen", data: {
            ...visibleData["RESP,na"], start_time: visibleData["RESP,na"]?.start_time ?? 0 // Default to 0 if undefined
        }, numberColor: "lightgreen"},
        // {title: "HR", unit: "bpm", color: "lightgreen", data: visibleData["HR,na"], optionPart: <FaHeart color="red" />, numberColor: "lightgreen"},
        // { title: "RR", unit: "%", color: "green", data: visibleData["RR,na"], numberColor: "green" },
        // { title: "ABP", unit: "mmHg", color: "red", data: visibleData["ABP,Dias"], optionPart: "120/80", numberColor: "red" },
        // { title: "ABP Mean", unit: "BPM", color: "darkyellow", data: visibleData["ABP,Mean"], numberColor: "darkyellow" },
        // { title: "ABP Syst", unit: "Celsius", color: "green", data: visibleData["ABP,Syst"], numberColor: "green" },
        // { title: "SpO2", unit: "mmHg", color: "lightblue", data: visibleData["SpO2,na"], numberColor: "lightblue" },
        // { title: "Tvesic", unit: "bpm", color: "purple", data: visibleData["Tvesic,na"], numberColor: "green" },
        // { title: "rSO2 Left", unit: "", color: "yellow", data: visibleData["rSO2,Left"], numberColor: "yellow" },
        // { title: "rSO2 Right", unit: "", color: "yellow", data: visibleData["rSO2,Right"], numberColor: "yellow" },
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