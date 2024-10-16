import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/LandingPageView.tsx";
import Monitor from './components/MonitorComponent.tsx';
// import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent

const App = () => { 
    return (
      <Routes>
        <Route path="/" element={<HomeView />} /> 
        <Route path=":patientId/monitor" element={<Monitor />} />

      </Routes>
    );
};

export default App;
