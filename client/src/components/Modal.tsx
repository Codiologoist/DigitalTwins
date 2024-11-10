import React, { useState } from 'react';
import { Doctor } from '../components/DoctorTable';

interface ModalProps {
  doctor: Doctor;
  onSave: (updatedDoctor: Doctor) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ doctor, onSave, onClose }) => {
  const [localDoctor, setLocalDoctor] = useState<Doctor>(doctor);

  const handleChange = (field: keyof Doctor, value: string) => {
    setLocalDoctor({ ...localDoctor, [field]: value });
  };

  const handleSave = () => {
    onSave(localDoctor);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-heading">Edit Doctor</h2>
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
