import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/LandingPageView.tsx";
import Monitor from './components/MonitorComponent.tsx';
import LoginComponent from './components/LoginComponent.tsx'; // Import LoginComponent
import NavBar from './components/NavbarComponent.tsx';
import DoctorPageComponent from './components/DoctorPageComponent.tsx'
import {useEffect, useState} from 'react';
import NotFound from './components/NotFoundComponent.tsx';
import AdminPageComponent from './components/AdminPageComponent.tsx';

const App = () => {
  
  const [userRole, setUserRole] = useState<'doctor' | 'admin' | null>(null); // State for tracking the user's role: 'doctor', 'admin', or null (for not logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for tracking the login status of the user
  
  // Function to handle logout, it sets isLoggedIn to false and clears the userRole
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };
  // useEffect hook to simulate user login for testing purpose, to be replaced by real feature implementation
  useEffect(() => {
    setUserRole('admin');
      setIsLoggedIn(true);
  }, []);

  return (
    <div>
        {/* Navbar component for navigation and logged-in user menu */}
        <NavBar
          // Details with login user to be implementated after having the authentication login feature 
          userRole={userRole} // Pass the current user role to the Navbar
          isLoggedIn={isLoggedIn} // Pass the login status to the Navbar
          onLogout={handleLogout} // Pass the logout function to the Navbar for handling logout actions
          />
          <Routes>
            <Route path="/" element={<HomeView />} /> 
            <Route path=":patientId/monitor" element={<Monitor />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/doctors/:SSN" element={<DoctorPageComponent />}/> {/* using /doctors/12 -> fake SSN for testing purpose, to be replaced */}
            <Route path="/doctors" element={<AdminPageComponent />}/> {/* Admin page route, blank page for now, to be replaced */}
            <Route path="*" element={<NotFound />}/> {/* Catch-all route for handling 404 pages */}
        </Routes>
      </div>
    );
};

export default App;
