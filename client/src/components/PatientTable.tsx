import React from 'react';
import Table from './Table';

// Define types for patient data
interface Patient {
  'First Name': string;
  'Last Name': string;
  'Personal Number': string;
}

const PatientTable: React.FC<{ data: Patient[] }> = ({ data }) => {
  const columns = ['First Name', 'Last Name', 'Personal Number'];

  return <Table columns={columns} data={data} />;
};

export default PatientTable;
