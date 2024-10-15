import React from 'react';
import Table from './Table';

// Define types for doctor data
interface Doctor {
  'Full Name': string;
  'Personal Number': string;
  'Username': string;
  'Password': string;
}

const DoctorTable: React.FC<{ data: Doctor[] }> = ({ data }) => {
  const columns = ['Full Name', 'Personal Number', 'Username', 'Password'];

  return <Table columns={columns} data={data} />;
};

export default DoctorTable;
