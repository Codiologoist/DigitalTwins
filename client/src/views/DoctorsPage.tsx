import React from 'react';
import PatientTable, {Patient} from '../components/PatientTable';


const PatientListPage: React.FC = () => {
  const patientData: Patient[]  = [ 
    {'_id': '123', firstName: 'David', lastName: 'Svenson', SSN: '200205156835' },
    {'_id': '321', firstName: 'John', lastName: 'Doe', SSN: '198504121234' },
    {'_id': '567', firstName: 'Jane', lastName: 'Smith', SSN: '199203058765' },
    {'_id': '234', firstName: 'Emily', lastName: 'Johnson', SSN: '197812253456' },
    {'_id': '568', firstName: 'Michael', lastName: 'Brown', SSN: '200001019876' },
    {'_id': '891', firstName: 'Sarah', lastName: 'Davis', SSN: '199507172345' }
  ];

  return (
    <div className="page-container">
      <h1>Patient List</h1>
      <PatientTable data={patientData} />
    </div>
  );
};

export default PatientListPage;
