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
    <div className="data_modal-overlay">
      <div className="data_modal">
        <h2 className="modal-heading">Data Trend Details</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Render the chart only when data is valid */}
        {!loading && !error && data && typeof data !== 'string' && (
          <div className="chart-container mb-4">
            <div  style={{ minWidth: '5000px' }} >
                <Line data={data as ChartData<'line'>} 
                    options={{
                        responsive: true,
                        maintainAspectRatio: false, // 禁用默认的宽高比，允许自定义尺寸
                        scales: {
                          x: {
                            ticks: {
                              maxRotation: 45, // 调整X轴标签的旋转角度
                              minRotation: 45,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 0.5, // 控制Y轴刻度的间隔
                            },
                          },
                        },
                      }}
                      style={{ width: "100%", height: "400px" }}/>
            </div>
          </div>
        )}

        {/* Show a message when there's no data */}
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