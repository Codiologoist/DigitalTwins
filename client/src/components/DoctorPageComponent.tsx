import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types/types';

const mockPatient: Patient = { 
    id: 123, firstName: "David", lastName: "Svensson" 
};
const DoctorPageComponent: React.FC = () => {
    const navigate = useNavigate();

    const handlePatienClick = (patient: Patient) => {
        navigate(`/${patient.id}/monitor`);
    }
    return (
        <div style={{ marginTop: '100px' }}>
            <h1>Doctor's page</h1>
            <p onClick={() => handlePatienClick(mockPatient)} style={{cursor: 'pointer', color:'blue'}}>
                {mockPatient.firstName} {mockPatient.lastName}
            </p>
        </div>
    );
};

export default DoctorPageComponent;