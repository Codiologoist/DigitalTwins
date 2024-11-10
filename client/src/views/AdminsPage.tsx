import React, {useState} from 'react';
import DoctorTable, {Doctor} from '../components/DoctorTable';
//import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Modal from '../components/Modal'

const AdminPage: React.FC = () => {
    //const navigate = useNavigate(); // Initialize useNavigate
    const [doctorData, setDoctorData] = useState<Doctor[]>([
      { _id: '111', firstName: 'John', lastName: 'Doe', SSN: '987654', username: 'jdoe', password: 'password123' },
      { _id: '222', firstName: 'Jane', lastName: 'Smith', SSN: '456789', username: 'jsmith', password: 'password456' }
    ]);

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  
     // Handle editing a doctor
    const handleEdit = (doctor: Doctor) => {
      setSelectedDoctor(doctor); // Set the selected doctor
      setIsModalOpen(true); // Open the modal
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

   // Function to save the changes in the modal
  const handleSaveChanges = (updatedDoctor: Doctor) => {
    const updatedDoctorData = doctorData.map((doctor) =>
      doctor._id === updatedDoctor._id ? updatedDoctor : doctor
    );
    setDoctorData(updatedDoctorData); // Update the state with the modified doctor
    setIsModalOpen(false); // Close the modal
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
      <div className="add-doctor-button-container">
        <div className="add-doctor-button">
          <button onClick={handleAddDoctor}>
            <span className="plus-sign">➕</span> Add Doctor
          </button>
        </div>
      </div>

      {/* Modal for editing the doctor */}
      {isModalOpen && selectedDoctor && (
        <Modal
          doctor={selectedDoctor}
          onSave={handleSaveChanges}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;