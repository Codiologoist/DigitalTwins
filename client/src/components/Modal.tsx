import React, { useState } from 'react';
import { Doctor } from '../components/DoctorTable';
import { Patient } from '../components/PatientTable';

interface DoctorModalProps {
  doctor: Doctor;
  onSave: (updatedDoctor: Doctor) => void;
  onClose: () => void;
  title: string;  // Add title prop to accept dynamic title
}

interface PatientModalProps {
  patient: Patient;
  onSave: (updatedPatient: Patient) => void;
  onClose: () => void;
  title: string;  // Add title prop to accept dynamic title
}

export const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onSave, onClose, title }) => {
  const [localPatient, setLocalPatient] = useState<Doctor>(doctor);

  const handleChange = (field: keyof Doctor, value: string) => {
    setLocalPatient({ ...localPatient, [field]: value });
  };

  const handleSave = () => {
    if (!localPatient.firstName) {
      alert('First Name is required.');
      return;
    }
    if (!localPatient.lastName) {
      alert('Last Name is required.');
      return;
    }
    if (!localPatient.SSN || !/^\d{12}$/.test(localPatient.SSN)) { // Validate SSN format if applicable
      alert('SSN is required and must be a valid 12-digit number.');
      return;
    }
    if (!localPatient.username) {
      alert('Username is required.');
      return;
    }
    if (!localPatient.password) {
      alert('Password is required.');
      return;
    }
  
    onSave(localPatient);  // Save changes when form is valid
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-heading">{title}</h2> {/* Use title prop here */}
        <form>
          <label>
            First Name:
            <input
              className="modal-input"
              type="text"
              value={localPatient.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              className="modal-input"
              type="text"
              value={localPatient.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </label>
          <label>
            SSN:
            <input
              className="modal-input"
              type="text"
              value={localPatient.SSN}
              onChange={(e) => handleChange('SSN', e.target.value)}
            />
          </label>
          <label>
            Username:
            <input
              className="modal-input"
              type="text"
              value={localPatient.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              className="modal-input"
              type="password"
              value={localPatient.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </label>
        </form>
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export const PatientModal: React.FC<PatientModalProps> = ({ patient, onSave, onClose, title }) => {
  const [localPatient, setLocalPatient] = useState<Patient>(patient);

  const handleChange = (field: keyof Patient, value: string) => {
    setLocalPatient({ ...localPatient, [field]: value });
  };

  const handleSave = () => {
    if (!localPatient.firstName) {
      alert('First Name is required.');
      return;
    }
    if (!localPatient.lastName) {
      alert('Last Name is required.');
      return;
    }
    if (!localPatient.SSN || !/^\d{12}$/.test(localPatient.SSN)) { // Validate SSN format if applicable
      alert('SSN is required and must be a valid 12-digit number.');
      return;
    }
    if (!localPatient.path) {
      alert('Path is required.');
      return;
    }
  
    onSave(localPatient);  // Save changes when form is valid
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-heading">{title}</h2> {/* Use title prop here */}
        <form>
          <label>
            First Name:
            <input
              className="modal-input"
              type="text"
              value={localPatient.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              className="modal-input"
              type="text"
              value={localPatient.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </label>
          <label>
            SSN:
            <input
              className="modal-input"
              type="text"
              value={localPatient.SSN}
              onChange={(e) => handleChange('SSN', e.target.value)}
            />
          </label>
          <label>
            Path:
            <input
              className="modal-input"
              type="text"
              value={localPatient.path}
              onChange={(e) => handleChange('path', e.target.value)}
            />
          </label>
        </form>
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
