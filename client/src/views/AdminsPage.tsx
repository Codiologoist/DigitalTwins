import React, {useState, useEffect} from 'react';
import DoctorTable, {Doctor} from '../components/DoctorTable';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios to make API calls


const AdminPage: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [doctorData, setDoctorData] = useState<Doctor[]>([]);  // Initialize state for doctor data
    
    // Fetch doctors from the backend when the component mounts
    useEffect(() => {
      const fetchDoctors = async () => {
          try {
              const response = await axios.get('/admin/doctors'); // Use relative URL
              setDoctorData(response.data.data); // Update state with the fetched doctors
          } catch (error) {
              console.error('Error fetching doctors:', error);
          }
      };

      fetchDoctors(); // Call the function to fetch doctors
    }, []); // Empty dependency array means this runs once when the component mounts
  
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