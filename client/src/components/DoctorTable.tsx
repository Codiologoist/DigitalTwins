import React from 'react';
import Table from './Table';

// Define types for doctor data
export interface Doctor {
  '_id': string;
  'firstName': string;
  'lastName': string;
  'SSN': string;
  'username': string;
  'password': string;
}

// Define props for DoctorTable, including onEdit and onDelete
interface DoctorTableProps {
    data: Doctor[];
    onEdit: (doctor: Doctor) => void; // Function to handle editing
    onDelete: (doctor: Doctor) => void; // Function to handle deleting
  }

  const DoctorTable: React.FC<DoctorTableProps> = ({ data, onEdit, onDelete }) => {
    const columns: string[] = ['firstName','lastName' , 'SSN', 'username', 'password'];

  return <Table columns={columns} data={data} onEdit={onEdit} onDelete={onDelete} />;
};

export default DoctorTable;
