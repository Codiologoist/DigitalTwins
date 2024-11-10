import React, { useState } from "react";

interface ModalProps {}

export const Modal: React.FC<ModalProps> = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    SSN: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="modal-container">
      <div className="modal">Modal</div>
      <form>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="SSN">SSN</label>
          <input
            name="SSN"
            value={formData.SSN}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};
