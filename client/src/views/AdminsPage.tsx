import React, { useState, useEffect } from 'react';
import DoctorTable, { Doctor } from '../components/DoctorTable';
import Modal from '../components/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

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

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

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
              <button onClick={handleAddDoctor}>
                <span className="plus-sign">➕</span> Add Doctor
              </button>
            </div>
          </div>

          {isModalOpen && selectedDoctor && (
            <Modal
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
