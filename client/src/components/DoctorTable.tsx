import React from 'react';

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
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>SSN</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doctor, rowIndex) => (
            <tr key={rowIndex}>
              <td>{doctor.firstName}</td>
              <td>{doctor.lastName}</td>
              <td>{doctor.SSN}</td>
              <td>{doctor.username}</td>
              <td>
                <div className="actions">
                  <button onClick={() => onEdit(doctor)}>Edit</button>
                  <button onClick={() => onDelete(doctor)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable;
