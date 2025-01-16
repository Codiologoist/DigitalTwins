import './App.css';
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/HomeView.tsx";
import AdminsPage from './views/AdminsPage.tsx';
import DoctorsPage from './views/DoctorsPage.tsx';
import Monitor from './components/MonitorComponent.tsx';
import LoginComponent from './components/LoginComponent.tsx';
import NavBar from './components/NavbarComponent.tsx';
import {useEffect, useState} from 'react';
import NotFound from './components/NotFoundComponent.tsx';
import PrivateRoute from './components/PrivateRouteComponent.tsx';

const App = () => {
  const [userRole, setUserRole] = useState<'doctor' | 'admin' | null>(null); // State for tracking the user's role: 'doctor', 'admin', or null (for not logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for tracking the login status of the user
  
  // useEffect hook to simulate user login for testing purpose, to be replaced by real feature implementation
  // useEffect(() => {
  //   setUserRole('admin');
  //     setIsLoggedIn(true);
  // }, []);

  useEffect(() => {
    // Check localStorage for token and userRole on app load
    const storedUserRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if (token && storedUserRole) {
      setIsLoggedIn(true); // Assume user is logged in if token exists
      setUserRole(storedUserRole as 'doctor' | 'admin'); // Set the role from localStorage
    }

  }, []); // Empty dependency array to run once on mount

  const handleLogin = (role: 'doctor' | 'admin') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  // Function to handle logout, it sets isLoggedIn to false and clears the userRole
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('token');
  };

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
            <Route path="/login" element={<LoginComponent onLogin={handleLogin}/>} /> {/* pass handleLogin as onLogin */}
            <Route path="/doctors/:SSN" element={<DoctorsPage  />}/> {/* using /doctors/12 -> fake SSN for testing purpose, to be replaced */}
            
            {/* Protect the Admin page route with PrivateRoute */}
            <Route
             path="/doctors"
             element={
               <PrivateRoute roleRequired="admin">
                 <AdminsPage />
               </PrivateRoute>
             }
            />      
            
            <Route path="*" element={<NotFound />}/> {/* Catch-all route for handling 404 pages */}
        </Routes>
      </div>
    );
};

export default App;
