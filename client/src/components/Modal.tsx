import React, { useState } from 'react';
import { Doctor } from '../components/DoctorTable';

interface ModalProps {
  doctor: Doctor;
  onSave: (updatedDoctor: Doctor) => void;
  onClose: () => void;
  title: string;  // Add title prop to accept dynamic title
}

const Modal: React.FC<ModalProps> = ({ doctor, onSave, onClose, title }) => {
  const [localDoctor, setLocalDoctor] = useState<Doctor>(doctor);

  const handleChange = (field: keyof Doctor, value: string) => {
    setLocalDoctor({ ...localDoctor, [field]: value });
  };

  const handleSave = () => {
    if (!localDoctor.firstName) {
      alert('First Name is required.');
      return;
    }
    if (!localDoctor.lastName) {
      alert('Last Name is required.');
      return;
    }
    if (!localDoctor.SSN || !/^\d{12}$/.test(localDoctor.SSN)) { // Validate SSN format if applicable
      alert('SSN is required and must be a valid 12-digit number.');
      return;
    }
    if (!localDoctor.username) {
      alert('Username is required.');
      return;
    }
    if (!localDoctor.password) {
      alert('Password is required.');
      return;
    }
  
    onSave(localDoctor);  // Save changes when form is valid
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
              value={localDoctor.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              className="modal-input"
              type="text"
              value={localDoctor.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </label>
          <label>
            SSN:
            <input
              className="modal-input"
              type="text"
              value={localDoctor.SSN}
              onChange={(e) => handleChange('SSN', e.target.value)}
            />
          </label>
          <label>
            Username:
            <input
              className="modal-input"
              type="text"
              value={localDoctor.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              className="modal-input"
              type="password"
              value={localDoctor.password}
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

export default Modal;
