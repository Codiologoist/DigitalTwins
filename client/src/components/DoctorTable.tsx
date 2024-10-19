import React from 'react';
import Table from './Table';

// Define types for doctor data
interface Doctor {
  'First Name': string;
  'Last Name': string;
  'SSN': string;
  'Username': string;
  'Password': string;
}

// Define props for DoctorTable, including onEdit and onDelete
interface DoctorTableProps {
    data: Doctor[];
    onEdit: (doctor: Doctor) => void; // Function to handle editing
    onDelete: (doctor: Doctor) => void; // Function to handle deleting
  }

  const DoctorTable: React.FC<DoctorTableProps> = ({ data, onEdit, onDelete }) => {
    const columns = ['First Name','Last Name' , 'SSN', 'Username', 'Password'];

    return <Table columns={columns} data={data} onEdit={onEdit} onDelete={onDelete} />;
};

export default DoctorTable;
