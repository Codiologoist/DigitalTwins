import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ChartData } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  data: ChartData<'line'> | string | null;
  error: string | null;
}

const DataTrendModal: React.FC<DataTrendModalProps> = ({
  isOpen,
  onClose,
  loading,
  data,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Data Trend Details</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Only show the chart if data is available */}
        {!loading && !error && data && typeof data !== 'string' && (
          <div className="mb-4">
            <Line data={data as ChartData<'line'>} />
          </div>
        )}

        {!loading && !error && !data && <p>No data available.</p>}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTrendModal;
