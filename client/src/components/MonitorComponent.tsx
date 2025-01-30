import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import usePatientData from "../hooks/usePatientData.ts";
import PatientHeader from "./PatientHeaderComponent.tsx";
import PatientSignals from "./PatientSignalsComponent.tsx";
import { AllDataType, Patient, RowData } from "../types/types.ts";
import { useParams } from "react-router-dom";
import Api from "../api.ts";

/* 
This compont represents the patient monitoring "page".
It fetches the patient data and displays it in a grid layout.
*/

interface response {
  data: Patient;
  success: boolean;
  message: string;
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
              Authorization: `${token}`,
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
    "ECG,II": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "ABP,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "RESP,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "HR,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "SpO2,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "RR,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
    "PLETH,na": {
      time_vector: [],
      measurement_data: [],
      sample_rates: [],
      start_time: 0,
    },
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

  const isNewPatient = useRef(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetchSelectedPatient(String(patientId));
  
        setPatientState(prevState => {
          // Check if the patient is actually different
          if (prevState.selectedPatient?.SSN !== response.selectedPatient?.SSN) {
            console.log("New patient detected, setting isNewPatient to true.");
            isNewPatient.current = true;
            return {
              selectedPatient: response.selectedPatient,
              isLoading: response.isLoading,
              isNotFound: response.isNotFound,
            };
          }
  
          // If the patient is the same, just update loading state (no need to set isNewPatient = true)
          return {
            selectedPatient: response.selectedPatient,
            isLoading: response.isLoading,
            isNotFound: response.isNotFound,
          };
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setPatientState({ selectedPatient: null, isLoading: false, isNotFound: true });
      }
    };
  
    fetchPatient();
  }, [patientId]); // Runs only when `patientId` changes
  
  
  const ssn = patientState.selectedPatient?.SSN || "";
  const path = patientState.selectedPatient?.path || "";

  // console.log("SSN:", ssn);
  // console.log("Path:", path);
  // console.log("isnewPatient:", isNewPatient.current);

  // This next line is for testing
  // visibleData = usePatientData(ssn, true, 5, path, false).visibleData;
  visibleData = usePatientData(ssn, false, 5, path, isNewPatient.current).visibleData;

  useEffect(() => {
    if (isNewPatient.current && ssn) {
      console.log("First-time fetch complete, setting isNewPatient to false.");
      isNewPatient.current = false; // Reset to false after first fetch
    }
  }, [ssn]);

  // Destructure state
  const {
    selectedPatient,
    isLoading: isPatientLoading,
    isNotFound,
  } = patientState;

  // Shows a loading message until the data has been populated
  if (isPatientLoading) {
    return <div className="text-blue-700">Loading...</div>;
  }
  // Shows a message when patient id is not valid
  if (isNotFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-blue-100 rounded-lg p-4 shadow-lg max-w-md text-center">
          <div className="text-blue-700 font-semibold text-lg">
            No data available for the selected patient.
          </div>
          <p className="text-blue-500 mt-2">
            Please check the patient ID or try again later.
          </p>
        </div>
      </div>
    );
  }
  // Ensures selectedPatient is not null before rendering PatientHeader
  if (!selectedPatient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-blue-100 rounded-lg p-4 shadow-lg max-w-md text-center">
          <div className="text-blue-700 font-semibold text-lg">
            No patient selected
          </div>
          <p className="text-blue-500 mt-2">
            Please check the patient ID or try again later.
          </p>
        </div>
      </div>
    );
  }

  // An array of row objects, each representing a row of data type to be displayed.
  const rowData: RowData[] = [
    // {title: "ECG", unit: "mV", color: "lightgreen", data: visibleData["ECG,II"], optionPart: <FaHeart color="red" />, numberColor: "lightgreen"},
    {
      title: "ECG",
      unit: "mV",
      color: "lightgreen",
      data: {
        ...visibleData["ECG,II"],
        start_time: visibleData["ECG,II"]?.start_time ?? 0, // Default to 0 if undefined
      },
      numberColor: "lightgreen",
      valueDisplayData: {
        ...visibleData["HR,na"],
        start_time: visibleData["HR,na"]?.start_time ?? 0, // Default to 0 if undefined
      },
      valueDisplayTitle: "HR",
      valueDisplayUnit: "bpm",
    },
    {
      title: "PLETH,na",
      unit: "",
      color: "yellow",
      data: {
        ...visibleData["PLETH,na"],
        start_time: visibleData["PLETH,na"]?.start_time ?? 0,
      },
      numberColor: "yellow",
      valueDisplayData: {
        ...visibleData["SpO2,na"],
        start_time: visibleData["SpO2,na"]?.start_time ?? 0, // Default to 0 if undefined
      },
      valueDisplayTitle: "SpO2",
      valueDisplayUnit: "%",
    },
    {
      title: "RESP,na",
      unit: "Ohms",
      color: "orange",
      data: {
        ...visibleData["RESP,na"],
        start_time: visibleData["RESP,na"]?.start_time ?? 0, // Default to 0 if undefined
      },
      numberColor: "orange",
      valueDisplayData: {
        ...visibleData["RR,na"],
        start_time: visibleData["RR,na"]?.start_time ?? 0, // Default to 0 if undefined
      },
      valueDisplayTitle: "RR",
      valueDisplayUnit: "",
    },
    {
      title: "ABP,na",
      unit: "mmHg",
      color: "lightgreen",
      data: {
        ...visibleData["ABP,na"],
        start_time: visibleData["ABP,na"]?.start_time ?? 0, // Default to 0 if undefined
      },
      numberColor: "lightgreen",
    },
  ];

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
