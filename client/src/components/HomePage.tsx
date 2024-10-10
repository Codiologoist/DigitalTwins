import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Codiologist</h1>
      <p className="text-lg text-gray-700 mb-6">
        This website is designed to help you manage patient data and health insights efficiently.
      </p>
      <button
        onClick={handleLoginClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Want to Login? Start Now!
      </button>
    </div>
  );
};

export default HomePage;
