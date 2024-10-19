import React from 'react';
import Table from './Table';

// Define types for patient data
interface Patient {
  'First Name': string;
  'Last Name': string;
  'SSN': string;
}

const PatientTable: React.FC<{ data: Patient[] }> = ({ data }) => {
  const columns = ['First Name', 'Last Name', 'SSN'];

  return <Table columns={columns} data={data} />;
};

export default PatientTable;
