import React, {useState} from 'react';
import DoctorTable from '../components/DoctorTable';

const AdminPage: React.FC = () => {
    const [doctorData, setDoctorData] = useState([
      { 'Full Name': 'Dr. John Doe', 'Personal Number': '987654', 'Username': 'jdoe', 'Password': 'password123' },
      { 'Full Name': 'Dr. Jane Smith', 'Personal Number': '456789', 'Username': 'jsmith', 'Password': 'password456' }
    ]);
  
    // Handle editing a doctor
    const handleEdit = (doctor: any) => {
      console.log('Edit doctor:', doctor);
      // Implement your edit logic here (e.g., open a modal with a form) PLACEHOLDER
    };
  
    // Handle deleting a doctor
    const handleDelete = (doctor: any) => {
      console.log('Deleted doctor:', doctor);
      // Remove the doctor from the list
      setDoctorData(doctorData.filter(d => d !== doctor));
    };
  
    return (
      <div className="page-container">
        <h1>Manage Doctors</h1>
        <DoctorTable data={doctorData} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    );
  };
  
  export default AdminPage;