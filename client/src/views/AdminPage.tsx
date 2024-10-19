import React, {useState} from 'react';
import DoctorTable from '../components/DoctorTable';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminPage: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [doctorData, setDoctorData] = useState([
      { 'First Name': 'Robert', 'Last Name': 'Brown', 'SSN': '123456', 'Username': 'rbrown', 'Password': 'password789' },
      { 'First Name': 'Emily', 'Last Name': 'Davis', 'SSN': '654321', 'Username': 'edavis', 'Password': 'password012' }
    ]);
  
     // Handle editing a doctor
    const handleEdit = (doctor: any) => {
     console.log('Edit doctor:', doctor);
     // Navigate to the EditDoctorPage, passing the doctor's data
     navigate('/editDoctor', { state: { doctor } }); // modify the path as needed
    };
  
    // Handle deleting a doctor with confirmation
    const handleDelete = (doctor: any) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete ${doctor['Full Name']}?`);
        
        // If user confirms deletion
        if (confirmDelete) {
          console.log('Deleted doctor:', doctor);
          // Remove the doctor from the list by filtering out the selected doctor
          setDoctorData(doctorData.filter(d => d !== doctor));
        }
        // If user cancels, do nothing
      };
  
    return (
      <div className="page-container">
        <h1>Manage Doctors</h1>
        <DoctorTable data={doctorData} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    );
  };
  
  export default AdminPage;