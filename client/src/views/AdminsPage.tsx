import React, { useState, useEffect } from 'react';
import DoctorTable, { Doctor } from '../components/DoctorTable';
import { DoctorModal} from '../components/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//Admin page where the admin can view all the doctors and handle their data

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    //checks if it's admin or not-checking for authorisation
    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }
    //all doctors are fetched
    axios.get('http://localhost:5000/api/v1/admin/doctors')
      .then(response => {
        console.log('Doctors fetched:', response.data);
        setDoctorData(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        alert('An error occurred while fetching doctors');
        setLoading(false);
      });
  }, [refreshData]);

  //Edit function opens up the modal when user asks to edit data
  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };
  //handleDelete function handles deletion on doctors after admin confirms deletion
  //delete function uses doctor id
  const handleDelete = (doctor: Doctor) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}?`);

    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/v1/admin/doctors/${doctor._id}`)
        .then(() => {
          setRefreshData(!refreshData);
        })
        .catch(error => {
          console.error("Error deleting doctor:", error);
          alert('An error occurred while deleting the doctor');
        });
    }
  };
  //this function saves the changes made to doctor's data, refreshes the page and closes the modal(form) for both editing and addition of doctor
  const handleSaveChanges = (newDoctor: Doctor) => {
    if (newDoctor._id) {
      axios.patch(`http://localhost:5000/api/v1/admin/doctors/${newDoctor._id}`, newDoctor)
        .then(() => {
          setRefreshData(!refreshData);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error updating doctor:", error);
          alert(error.response?.data.message || 'An error occurred while updating the doctor');
        });
    } else {
      axios.post('http://localhost:5000/api/v1/admin/doctors', newDoctor)
        .then(() => {
          setRefreshData(!refreshData);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error adding doctor:", error);
          alert(error.response?.data.message || 'An error occurred while adding the doctor');
        });
    }
  };

  //function to add a new doctor and opening the form to fill in the information
  const handleAddDoctor = () => {
    setSelectedDoctor({
      _id: '',
      firstName: '',
      lastName: '',
      SSN: '',
      username: '',
      password: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <>
          <DoctorTable data={doctorData} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="add-doctor-button-container">
            <div className="add-doctor-button">
              {/*Interactive button to add doctors */}
              <button onClick={handleAddDoctor}>
                <span className="plus-sign">➕</span> Add Doctor
              </button>
            </div>
          </div>
          {/*calls necessary functions and shows the title of the form as per the function called (e.g. edit or add)*/}
          {isModalOpen && selectedDoctor && (
            <DoctorModal
              doctor={selectedDoctor}
              onSave={handleSaveChanges}
              onClose={() => setIsModalOpen(false)}
              title={selectedDoctor._id ? "Edit Doctor" : "Add Doctor"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
