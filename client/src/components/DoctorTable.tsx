import React from 'react';
import Table from './Table';
import { mapDataToHeaders } from '../functions/dataMapper';

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
    const headersMapping = {
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'SSN': 'SSN',
      'Username': 'username',
      'Password': 'password'
    };

     // Use the utility function to map data to headers
  const mappedTableData = mapDataToHeaders(data, headersMapping);

    return <Table columns={columns} data={mappedTableData} onEdit={onEdit} onDelete={onDelete} />;
};

export default DoctorTable;
