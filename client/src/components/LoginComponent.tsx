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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setIsLoggedIn] = useState(false);
  // const [userRole, setUserRole] = useState<'doctor' | 'admin' | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    setError(null);

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
      const response = await Api.post("/login", {
        username,
        password,
      });
      
      const data = response.data;

      if (data.success) {
        // Store Token and navigate
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        // Update the App state with onLogin
        // Call onLogin function passed from App component
        onLogin(data.role);
        //setUserRole(data.role);
        setIsLoggedIn(true);
        // Navigate based on user role
        if (data.role === 'admin') {
          navigate('/doctors'); // Redirect admin to /doctors page
        } else if (data.role === 'doctor') {
          navigate('/doctors/12'); // Redirect doctor to their page (use dynamic ID later)
        }
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message;
          setError(errorMessage);
      } else {
          console.error("Login request failed:", error);
      }
    }
    
  };

  return (
    <>
      {/* <Navbar userRole={userRole} isLoggedIn={isLoggedIn} onLogout={() => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('token');
      }} /> */}
      
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
