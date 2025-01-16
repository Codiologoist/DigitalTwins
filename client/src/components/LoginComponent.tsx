import axios from 'axios';
import Api from '../api';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Define the props for LoginComponent
interface LoginComponentProps {
  onLogin: (role: 'doctor' | 'admin') => void; // Define onLogin as a prop
}

export default function LoginComponent({ onLogin }: LoginComponentProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // State to hold the username input
  const [password, setPassword] = useState(""); // State to hold the password input
  const [usernameError, setUsernameError] = useState<string | null>(null); // State to handle username validation errors
  const [passwordError, setPasswordError] = useState<string | null>(null); // State to handle password validation errors
  const [error, setError] = useState<string | null>(null); // State to handle server-side errors
  const [, setIsLoggedIn] = useState(false); // State to track if the user is logged in

  // Function to handle the form submission for login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false; // Flag to track if there are any validation errors
    setError(null); // Reset the general error message

    // Check if username is empty
    if (!username.trim()) {
      setUsernameError("Username is required.");
      hasError = true;
    } else {
      setUsernameError(null);
    }

    // Check if password is empty
    if (!password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return; // Stop submission if validation fails

    try {
      // Make an API request to authenticate the user
      const response = await Api.post("/login", {
        username,
        password,
      });
      
      const data = response.data; // Get the data from the API response

      // If login is successful, proceed with storing the token and user data
      if (data.success) {
        localStorage.setItem("token", data.token); // Store the authentication token in localStorage
        localStorage.setItem("userRole", data.role); // Store the user role in localStorage
        onLogin(data.role); // Call the onLogin function to update the role in the parent component
        setIsLoggedIn(true); // Update the login state
        // Navigate based on user role
        if (data.role === 'admin') {
          navigate('/doctors'); // Redirect admin to /doctors page
        } else if (data.role === 'doctor') {
          navigate(`/doctors/${data.user.id}`); // Redirect doctor to their page
        }
      } 
    } catch (error) {
      // Handle errors from the API request
      if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message; // Get the error message from the response
          setError(errorMessage); // Set the error message to display it in the UI
      } else {
          console.error("Login request failed:", error); // Log any unexpected errors on console
      }
    }
    
  };

  return (
    <>
      
      {/* Login form */}
      <div className="relative isolate min-h-screen">
        {/* Content container */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-40 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                      usernameError ? 'ring-red-500' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {usernameError && (
                  <p className="mt-2 text-sm text-red-600">{usernameError}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                      passwordError ? 'ring-red-500' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSignIn}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </>
  );
}
