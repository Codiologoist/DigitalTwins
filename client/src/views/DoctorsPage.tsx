import React, { useState, useEffect } from 'react';
import PatientTable, { Patient } from '../components/PatientTable';
import { PatientModal} from '../components/Modal';
import Api from '../api';
import { useNavigate } from 'react-router-dom';

//Doctors page where the doctor can view all the patients and monitor their health status
const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    Api.get('/patients', {
      headers: {
        Authorization: `${token}`
      }
    }).then(response => {
        setPatientData(response.data.data);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching patients:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert('An error occurred while fetching patients.');
        }
        setLoading(false);
      });
  }, [refreshData]);
  //Edit function opens up the modal when user asks to edit data
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = (patient: Patient) => {
    const token = localStorage.getItem('token');
    const confirmDelete = window.confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`);
    //handleDelete function handles deletion of patients after doctor confirms deletion
    //delete function uses patient id  
    if (confirmDelete) {
      Api.delete(`patients/${patient.SSN}`, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(() => {
          setRefreshData(!refreshData);
        })
        .catch(error => {
          console.error("Error deleting patient:", error);
          alert('An error occurred while deleting the patient');
        });
    }
  };
  //this function saves the changes made to patient's data, refreshes the page and closes the modal(form) for both editing and addition of patient
  const handleSaveChanges = (newPatient: Patient) => {
    const token = localStorage.getItem('token');
    if (newPatient._id) {
      Api.patch(`patients/${newPatient.SSN}`, newPatient, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(() => {
          setRefreshData(!refreshData);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error updating patient:", error);
          alert(error.response?.data.message || 'An error occurred while updating the patient');
        });
    } else {
      console.log(newPatient);
      Api.post(`patients`, newPatient, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(() => {
          setRefreshData(!refreshData);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error("Error adding patient:", error);
          alert(error.response?.data.message || 'An error occurred while adding the patient');
        });
    }
  };
  //function to add a new patient and opening the form to fill in their information
  const handleAddPatient = () => {
    setSelectedPatient({
      _id: '',
      firstName: '',
      lastName: '',
      SSN: '',
      path: '' 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <>
          <PatientTable data={patientData} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="add-doctor-button-container">
            {/*Interactive button to add patients */}
            <div className="add-doctor-button">
              <button onClick={handleAddPatient}>
                <span className="plus-sign">➕</span> Add Patient
              </button>
            </div>
          </div>
          {/*calls necessary functions and shows the title of the form as per the function called (e.g. edit or add)*/}
          {isModalOpen && selectedPatient && (
            <PatientModal
              patient={selectedPatient}
              onSave={handleSaveChanges}
              onClose={() => setIsModalOpen(false)}
              title={selectedPatient.SSN ? "Edit Patinet" : "Add Patient"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientListPage;
