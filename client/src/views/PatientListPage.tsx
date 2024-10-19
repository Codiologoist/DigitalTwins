import React from 'react';
import PatientTable from '../components/PatientTable';

const PatientListPage: React.FC = () => {
  const patientData = [
    {'First Name': 'John', 'Last Name': 'Doe', SSN: '198504121234' },
    {'First Name': 'Jane', 'Last Name': 'Smith', SSN: '199203058765' },
    {'First Name': 'Emily', 'Last Name': 'Johnson', SSN: '197812253456' },
    {'First Name': 'Michael', 'Last Name': 'Brown', SSN: '200001019876' },
    {'First Name': 'Sarah', 'Last Name': 'Davis', SSN: '199507172345' }
  ];

  return (
    <div className="page-container">
      <h1>Patient List</h1>
      <PatientTable data={patientData} />
    </div>
  );
};

export default PatientListPage;
