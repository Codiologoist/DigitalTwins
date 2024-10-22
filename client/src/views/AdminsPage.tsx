import React, {useState} from 'react';
import DoctorTable, {Doctor} from '../components/DoctorTable';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const AdminPage: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [doctorData, setDoctorData] = useState<Doctor[]>([
      { _id: '111', firstName: 'John', lastName: 'Doe', SSN: '987654', username: 'jdoe', password: 'password123' },
      { _id: '222', firstName: 'Jane', lastName: 'Smith', SSN: '456789', username: 'jsmith', password: 'password456' }
    ]);
  
  
     // Handle editing a doctor
    const handleEdit = (doctor: Doctor) => {
     console.log('Edit doctor:', doctor);
     // Navigate to the EditDoctorPage, passing the doctor's data
     navigate('/editDoctor', { state: { doctor } }); // modify the path as needed
    };
  
    // Handle deleting a doctor with confirmation
    const handleDelete = (doctor: Doctor) => {
       console.log('Doctor object before deletion:', doctor); // Log the entire doctor object
      // Show confirmation dialog
      const confirmDelete = window.confirm(`Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}?`);

      // If user confirms deletion
      if (confirmDelete) {
        console.log('Deleted doctor:', doctor);
        // Remove the doctor from the list by filtering out the selected doctor
        setDoctorData(doctorData.filter(d => d._id !== doctor._id));
      } else {
      console.log('Deletion canceled');
      }
   };
  

    // Function to add a new doctor
    const handleAddDoctor = () => {
      const newDoctor: Doctor = {
          _id: (doctorData.length + 1).toString(), // Simple ID generation
          firstName: 'New',
          lastName: 'Doctor',
          SSN: '000000',
          username: 'newdoctor',
          password: 'newpassword123'
      };

      // Add the new doctor to the state
      setDoctorData([...doctorData, newDoctor]);
  };

    return (
      <div className="page-container">
        <DoctorTable data={doctorData} onEdit={handleEdit} onDelete={handleDelete} />
        {/* Add Doctor Button Positioned to the right */}
        <div className="add-doctor-button-container">
          <div className="add-doctor-button">
             <button onClick={handleAddDoctor}>
               <span className="plus-sign">➕</span> Add Doctor
             </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminPage;