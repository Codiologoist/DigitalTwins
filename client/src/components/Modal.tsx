import React, { useState } from 'react';

interface ModalProps {
  firstName: string;
  lastName: string;
  ssn: string;
  username: string;
  password: string;
  onChange: (field: string, value: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  firstName,
  lastName,
  ssn,
  username,
  password,
  onChange,
}) => {
  // Local state to handle the form fields
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    ssn,
    username,
    password,
  });

  // Handle field changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      // Call onChange callback with field name and new value
      onChange(name, value);
      return updatedData;
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1 className='modal-heading'>Edit Doctor</h1>
        <form>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleFieldChange}
            className="modal-input"
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFieldChange}
            className="modal-input"
          />

          <label>SSN</label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn}
            onChange={handleFieldChange}
            className="modal-input"
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFieldChange}
            className="modal-input"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFieldChange}
            className="modal-input"
          />

          <button className='save-button' type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
