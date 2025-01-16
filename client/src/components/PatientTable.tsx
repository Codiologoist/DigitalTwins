import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for patient data
export interface Patient {
  '_id': string;
  'firstName': string;
  'lastName': string;
  'SSN': string;
  'path': string;
}

// Define props for PatientTable, including onEdit and onDelete
interface PatinetTableProps {
  data: Patient[];
  onEdit: (patient: Patient) => void; // Function to handle editing
  onDelete: (patient: Patient) => void; // Function to handle deleting
}

const PatientTable: React.FC<PatinetTableProps> = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (patientId: string) => {
    localStorage.setItem("patientSSN", patientId);
    navigate(`/${patientId}/monitor`);
  };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>SSN</th>
            <th>File Path</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((patient, rowIndex) => (
            <tr key={rowIndex}>
              <td>{patient.firstName}</td>
              <td>{patient.lastName}</td>
              <td>{patient.SSN}</td>
              <td>{patient.path}</td>
              <td>
                <div className="actions">
                  <button onClick={() => handleNavigation(patient.SSN)}>Monitor</button>
                  <button onClick={() => onEdit(patient)}>Edit</button>
                  <button onClick={() => onDelete(patient)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
