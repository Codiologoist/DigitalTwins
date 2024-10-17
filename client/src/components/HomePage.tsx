import icuImage from "../assets/icu_image.png";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6 pt-10 bg-white font-sans">
      {/* Text Section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 text-center md:text-left">
          Welcome to Codiologist!
        </h1>
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center md:text-left">
          Monitoring Made Simple
        </h2>
        <p className="text-lg text-gray-800 mb-6 text-center md:text-left">
          Our platform assists healthcare professionals in managing patient data and health insights efficiently.
          Monitor your patients effectively with real-time Moberg monitor data, ensuring optimal care for neuro-intensive patients.
        </p>
        <p className="text-md text-gray-700 text-center md:text-left">
          Explore the possibilities of real-time monitoring and improve patient care with our innovative solutions.
        </p>
      </div>
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end p-4 md:p-0">
        <img
         src={icuImage}
         alt="ICU Image"
         className="w-full h-auto md:max-h-96 object-contain rounded-lg shadow-md" // Adjust max height and add shadow for depth
        />
      </div>
    </div>
  );
};

export default HomePage;
