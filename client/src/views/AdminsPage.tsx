import React, { useState, useEffect } from 'react';
import DoctorTable, { Doctor } from '../components/DoctorTable';
import Modal from '../components/Modal';
import axios from 'axios';

const AdminPage: React.FC = () => {
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);  // Start with an empty array for doctor data
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [loading, setLoading] = useState(true); // Loading state to show a loading message while fetching data

  // Fetch doctor data from the server
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/admin/doctors')
      .then(response => {
        console.log('Doctors fetched:', response.data);  // Debugging log
        setDoctorData(response.data.data); // Ensure you're using the correct key from the API response
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        alert('An error occurred while fetching doctors');
        setLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array means this effect runs once when the component is mounted

  // Handle editing a doctor
  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor); // Set the selected doctor
    setIsModalOpen(true); // Open the modal
  };

  // Handle deleting a doctor with confirmation
  const handleDelete = (doctor: Doctor) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}?`);

    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/v1/admin/doctors/${doctor.SSN}`)
        .then(() => {
          setDoctorData(doctorData.filter(d => d._id !== doctor._id));
        })
        .catch(error => {
          console.error("Error deleting doctor:", error);
          alert('An error occurred while deleting the doctor');
        });
    }
  };

  // Save the changes or new doctor in the modal
  const handleSaveChanges = (newDoctor: Doctor) => {
    if (newDoctor.SSN) { // If doctor has SSN (exists), update
      axios.patch(`http://localhost:5000/api/v1/admin/doctors/${newDoctor.SSN}`, newDoctor)
        .then(() => {
          setDoctorData(doctorData.map(d => (d.SSN === newDoctor.SSN ? newDoctor : d)));
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error updating doctor:", error);
          alert('An error occurred while updating the doctor');
        });
    } else { // If doctor does not have SSN, create a new doctor
      axios.post('http://localhost:5000/api/v1/admin/doctors', newDoctor)
        .then(response => {
          setDoctorData([...doctorData, response.data]);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error adding doctor:", error);
          alert('An error occurred while adding the doctor');
        });
    }
  };

  // Function to add a new doctor
  const handleAddDoctor = () => {
    setSelectedDoctor({
      _id: '',  // New doctor has no ID initially
      firstName: '',
      lastName: '',
      SSN: '',
      username: '',
      password: ''
    });
    setIsModalOpen(true); // Open the modal for adding a new doctor
  };

  return (
    <div className="page-container">
      {/* Conditionally render loading state */}
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <>
          <DoctorTable data={doctorData} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="add-doctor-button-container">
            <div className="add-doctor-button">
              <button onClick={handleAddDoctor}>
                <span className="plus-sign">➕</span> Add Doctor
              </button>
            </div>
          </div>

          {/* Modal for ADDING/editing the doctor */}
          {isModalOpen && selectedDoctor && (
            <Modal
              doctor={selectedDoctor}
              onSave={handleSaveChanges}
              onClose={() => setIsModalOpen(false)}
              title={selectedDoctor._id ? "Edit Doctor" : "Add Doctor"} // Dynamic modal title
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
