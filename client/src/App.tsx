import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/LandingPageView.tsx";
import Monitor from './components/MonitorComponent.tsx';
import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent

const App = () => { 
    return (
      <Routes>
        <Route path="/" element={<HomeView />} /> 
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/login" element={<LoginComponent />} /> {/* Route for login page */}
      </Routes>
    );
};

export default App;
