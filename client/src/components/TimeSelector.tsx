import React, { useState } from 'react';

const TimeSelector: React.FC = () => {
    const [selectedTime, setSelectedTime] = useState('1min');

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(event.target.value);
    };

    return (
        <div>
            <label htmlFor="time-dropdown">Select Time Interval: </label>
            <select id="time-dropdown" value={selectedTime} onChange={handleTimeChange}>
                <option value="1min">1min</option>
                <option value="10min">10min</option>
                <option value="30min">30min</option>
                <option value="1hr">1hr</option>
            </select>
        </div>
    );
};

export default TimeSelector;
