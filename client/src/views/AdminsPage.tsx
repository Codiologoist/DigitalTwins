import React, { useState, useEffect } from 'react';
import DoctorTable, { Doctor } from '../components/DoctorTable';
import { DoctorModal} from '../components/Modal';
import Api from '../api';
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

    Api.get('/admin//doctors', {
      headers: {
        Authorization: `${token}`
      }
    })
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
    const token = localStorage.getItem('token');
    const confirmDelete = window.confirm(`Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}?`);

    if (confirmDelete) {
      Api.delete(`admin/doctors/${doctor._id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
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
    const token = localStorage.getItem('token');
    if (newDoctor._id) {
      console.log(newDoctor);
      Api.patch(`admin/doctors/${newDoctor._id}`, newDoctor, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(() => {
          setRefreshData(!refreshData);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error updating doctor:", error);
          alert(error.response?.data.message || 'An error occurred while updating the doctor');
        });
    } else {
      Api.post('admin/doctors', newDoctor, {
        headers: {
          Authorization: `${token}`
        }
      })
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
            <DoctorModal
              doctor={selectedDoctor}
              onSave={handleSaveChanges}
              onClose={() => setIsModalOpen(false)}
              title={selectedDoctor.SSN ? "Edit Doctor" : "Add Doctor"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
