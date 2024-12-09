import React from 'react';

interface TimeSelectorProps {
    selectedTimeInterval: number;
    setSelectedTimeInterval: (value: number) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTimeInterval, setSelectedTimeInterval }) => {
    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTimeInterval(Number(event.target.value));
    };

    return (
        <div className="flex items-center">
            <select
                id="time-dropdown"
                value={selectedTimeInterval}
                onChange={handleTimeChange}
                className="py-2 px-4 rounded-lg border-2 border-teal-500 bg-teal-100 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                <option value={1}>1min</option>
                <option value={10}>10min</option>
                <option value={30}>30min</option>
                <option value={60}>1hr</option>
            </select>
        </div>
    );
};

export default TimeSelector;
