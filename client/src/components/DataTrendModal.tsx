import React from "react";
import { Line } from "react-chartjs-2"; // Import the Line chart component from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"; // Import necessary Chart.js components
import { ChartData } from 'chart.js'; // Import ChartData type for type-checking the chart data

// Register the necessary Chart.js components for the chart to work properly
ChartJS.register(
  CategoryScale,   // Register category scale (for x-axis)
  LinearScale,     // Register linear scale (for y-axis)
  PointElement,    // Register point element (for rendering data points)
  LineElement,     // Register line element (for rendering the line)
  Title,           // Register title (for the chart title)
  Tooltip,         // Register tooltip (for showing information when hovering over data points)
  Legend           // Register legend (for showing a legend)
);

interface DataTrendModalProps {
  isOpen: boolean;        // Whether the modal is open
  onClose: () => void;    // Function to close the modal
  loading: boolean;       // Loading state (true if data is still being fetched)
  data: ChartData<'line'> | string | null; // The data to be displayed in the chart (could be Chart.js data, an error message, or null)
  error: string | null;   // Error message, if any
  timeRange: number;      // The time range value (used to adjust chart width)
}

// DataTrendModal component for displaying the data trend in a modal
const DataTrendModal: React.FC<DataTrendModalProps> = ({
  isOpen,      // Whether the modal is open
  onClose,     // Function to close the modal
  loading,     // Loading state
  data,        // The data to be displayed in the chart
  error,       // Error message, if any
  timeRange    // Time range (used for chart styling)
}) => {
  if (!isOpen) return null; // If the modal is not open, do not render anything

  return (
    <div className="data_modal-overlay"> {/* Overlay for the modal */}
      <div className="data_modal">  {/* The modal content */}
        <h2 className="modal-heading">Data Trend Details</h2> {/* Modal title */}

        {loading && <p>Loading...</p>}  {/* Show loading message if data is being fetched */}
        {error && <p className="text-red-500">{error}</p>}  {/* Show error message if there's an error */}

        {/* Render the chart only if data is available and not a string (i.e., not an error message) */}
        {!loading && !error && data && typeof data !== 'string' && (
          <div className="chart-container mb-4"> {/* Container for the chart */}
            <div  style={{ minWidth: `${timeRange * 100}px` }} > {/* Set dynamic min-width based on timeRange */}
                <Line 
                  data={data as ChartData<'line'>} 
                  options={{
                    responsive: true,  // Make the chart responsive (adjust its size on window resize)
                    maintainAspectRatio: false, // Allow the chart to stretch and fill the container
                    scales: {           // Configuration for chart axes
                      x: {
                        ticks: {           // Configure x-axis ticks (time axis)
                          maxRotation: 45, // Max rotation for tick labels
                          minRotation: 45, // Min rotation for tick labels
                        },
                      },
                      y: {
                        beginAtZero: true,  // Start the y-axis from 0
                        ticks: {            // Configure y-axis ticks
                          stepSize: 0.5,    // Define the step size for ticks
                        },
                      },
                    },
                  }}
                  style={{ width: "100%", height: "400px" }}  // Set chart width and height
                />
            </div>
          </div>
        )}

        {/* Show a message when there's no data */}
        {!loading && !error && !data && <p>No data available.</p>}

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}  // Call the onClose function when clicked
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"  // Styling for the close button
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTrendModal;
