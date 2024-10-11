import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/HomeView.tsx";
import Monitor from './components/MonitorComponent.tsx';


const App = () => { 
    return (
      // Manage routes of page view
      <Routes>

        <Route path="/" element={<HomeView />} /> 
        <Route path=":patientId/monitor" element={<Monitor />} />

      </Routes>
    );
};

export default App;