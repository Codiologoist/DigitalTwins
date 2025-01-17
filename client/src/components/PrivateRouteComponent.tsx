import { Navigate } from "react-router-dom";

/*This component is a custom route component that checks if the user is logged in 
and has the required role to access a specific page.*/
interface PrivateRouteProps {
  children: JSX.Element;
  roleRequired: "admin" | "doctor"; // Specify which role is required
}

const PrivateRoute = ({ children, roleRequired }: PrivateRouteProps) => {
  const userRole = localStorage.getItem("userRole"); // Retrieve the stored user role
  const token = localStorage.getItem("token"); // Retrieve the token to check if the user is logged in

  if (!token || userRole !== roleRequired) {
    // If the user is not logged in or does not have the required role
    alert(
      "You need to be logged in as an authorized admin to access this page."
    );
    return <Navigate to="/login" replace />; // Redirect to the login page
  }

  return children; // If the user is authorized, return the protected page (children)
};

export default PrivateRoute;
