import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for patient data
export interface Patient {
  '_id': string;
  'firstName': string;
  'lastName': string;
  'SSN': string;
}

const PatientTable: React.FC<{ data: Patient[] }> = ({ data }) => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (patientId: string) => {
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
          </tr>
        </thead>
        <tbody>
          {data.map((patient, rowIndex) => (
            <tr key={rowIndex}>
              <td>{patient.firstName || 'N/A'}</td>
              <td>
                <span
                  onClick={() => handleNavigation(patient._id)}
                  style={{ cursor: 'pointer', color: 'darkblue' }}
                >
                  {patient.lastName}
                </span>
              </td>
              <td>
                <span
                  onClick={() => handleNavigation(patient._id)}
                  style={{ cursor: 'pointer', color: 'darkblue' }}
                >
                  {patient.SSN}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
