import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/LandingPageView.tsx";
import Monitor from './components/MonitorComponent.tsx';
import api from './api.ts';
// import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent

const App = () => {
    // create Dummy patient
    const patient = {
      SSN: "199901045678",
      name : {
        firstName: "C001",
        lastName: "",
      },
    };

    api.post('/patients', patient).then((response) => {
      console.log(response);
      localStorage.setItem('SSN', response.data.patient.SSN);
    }).catch((error) => {
      console.log(error);
    })

    return (
      <Routes>
        <Route path="/" element={<HomeView />} /> 
        <Route path=":patientId/monitor" element={<Monitor />} />

      </Routes>
    );
};

export default App;
