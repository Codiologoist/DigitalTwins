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
    const columns: string[] = ['First Name','Last Name' , 'SSN', 'Username', 'Password'];
    
    // Map data to the required structure directly within the component
  const mappedTableData = data.map(doctor => ({
    'First Name': doctor.firstName,
    'Last Name': doctor.lastName,
    'SSN': doctor.SSN,
    'Username': doctor.username,
    'Password': doctor.password
  }));

  return <Table columns={columns} data={mappedTableData} onEdit={onEdit} onDelete={onDelete} />;
};

export default DoctorTable;
