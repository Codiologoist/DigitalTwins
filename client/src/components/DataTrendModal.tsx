import React from "react";

interface DataTrendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DataTrendModal: React.FC<DataTrendModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Return null if the modal is not open

    return (
        
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Data Trend Details</h2>
                <p className="mb-4">Here you can display detailed data trend information for the selected time range.</p>

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
