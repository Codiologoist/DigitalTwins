import React from 'react';
import Table from './Table';
import { mapDataToHeaders } from '../functions/dataMapper';
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
  const headersMapping = {
    'First Name': 'firstName',
    'Last Name': 'lastName',
    'SSN': 'SSN'
  };

  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (patientId: string) => {
    navigate(`/${patientId}/monitor`);
  };

  // Map data to include onClick handler for last name and SSN
  const tableData = data.map((patient) => ({
    ...patient,
    'lastName': <span onClick={() => handleNavigation(patient._id)} style={{ cursor: 'pointer', color: 'darkblue' }}>
      {patient.lastName}
      </span>,
    'SSN': <span onClick={() => handleNavigation(patient._id)} style={{ cursor: 'pointer', color: 'darkblue' }}>   
      {patient.SSN}
      </span>,
  }));

  // Use the utility function to map data to headers
  const mappedTableData = mapDataToHeaders(tableData, headersMapping);

  return <Table columns={columns} data={mappedTableData} />;
};

export default PatientTable;
