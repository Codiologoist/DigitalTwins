import React from 'react';
import PatientTable from '../components/PatientTable';

const PatientListPage: React.FC = () => {
  const patientData = [
    { 'First Name': 'John', 'Last Name': 'Doe', 'Personal Number': '123456' },
    { 'First Name': 'Jane', 'Last Name': 'Smith', 'Personal Number': '654321' }
  ];

  return (
    <div className="page-container">
      <h1>Patient List</h1>
      <PatientTable data={patientData} />
    </div>
  );
};

export default PatientListPage;
