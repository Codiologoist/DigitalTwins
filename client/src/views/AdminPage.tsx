import React from 'react';
import DoctorTable from '../components/DoctorTable';

const AdminPage: React.FC = () => {
  const doctorData = [
    { 'Full Name': 'Dr. John Doe', 'Personal Number': '987654', 'Username': 'jdoe', 'Password': 'password123' },
    { 'Full Name': 'Dr. Jane Smith', 'Personal Number': '456789', 'Username': 'jsmith', 'Password': 'password456' }
  ];

  return (
    <div className="page-container">
      <h1>Manage Doctors</h1>
      <DoctorTable data={doctorData} />
    </div>
  );
};

export default AdminPage;
