import React from 'react';
import Table from './Table';
import { useNavigate } from 'react-router-dom';


// Define types for patient data
export interface Patient {
  '_id': string;
  'firstName': string;
  'lastName': string;
  'SSN': string;
}

const PatientTable: React.FC<{ data: Patient[] }> = ({ data }) => {
  const columns = ['First Name', 'Last Name', 'SSN'];
 
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (patientId: string) => {
    navigate(`/${patientId}/monitor`);
  };

  // Map data to include onClick handler for last name and SSN
  const mappedTableData = data.map((patient) => ({
    'First Name': patient.firstName || 'N/A',  // Fallback if missing
    'Last Name': (
      <span
        onClick={() => handleNavigation(patient._id)}
        style={{ cursor: 'pointer', color: 'darkblue' }}
      >
        {patient.lastName}
      </span>
    ),
    'SSN': (
      <span
        onClick={() => handleNavigation(patient._id)}
        style={{ cursor: 'pointer', color: 'darkblue' }}
      >
        {patient.SSN}
      </span>
    ),
  }));

  return <Table columns={columns} data={mappedTableData} />;
};

export default PatientTable;
