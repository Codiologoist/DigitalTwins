import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/HomeView.tsx";
import AdminPage from './views/AdminPage.tsx';
import PatientListPage from './views/PatientListPage.tsx';
import EditDoctorPage from './views/EditDoctorPage.tsx';
import Monitor from './components/MonitorComponent.tsx';
import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent

const App = () => { 
    return (
      <Routes>
        
        <Route path="/" element={<HomeView />} /> 
        <Route path=":patientId/monitor" element={<Monitor />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/doctorTable" element={<AdminPage />} /> {/* later on add admin id to url {:adminID} */}
        <Route path="/patientTable" element={<PatientListPage/>} /> {/* later on add doctor id to url {:adminID}*/}
        <Route path="/editDoctor" element={<EditDoctorPage/>} /> {/* later on add doctor (&maybe admin) id to url {:adminID}*/}

      </Routes>
    );
};

export default App;
