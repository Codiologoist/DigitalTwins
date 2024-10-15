import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/LandingPageView.tsx";
import AdminPage from './views/AdminPage.tsx';
import PatientListPage from './views/PatientListPage.tsx';
import Monitor from './components/MonitorComponent.tsx';
import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent

const App = () => { 
    return (
      <Routes>
        
        <Route path="/" element={<HomeView />} /> 
        <Route path=":patientId/monitor" element={<Monitor />} />
        <Route path="/login" element={<LoginComponent />} /> {/* Add this line */}
        <Route path="/doctorTable" element={<AdminPage />} /> 
        <Route path="/patientTable" element={<PatientListPage/>} /> 


      </Routes>
    );
};

export default App;
