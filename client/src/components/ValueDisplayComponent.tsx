import React from "react";

//**
// This component responsible for displaying the measurement value on the right side of the graph.
// It dynamically updates the displayed value (e.g., heart rate, ECG, or other measurement)
// with appropriate formatting, color, and units.
//*/

interface ValueDisplayProps {
  optionPart?: React.ReactNode;
  currentValue: string | number;
  title: string;
  unit: string;
  numberColor?: string;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({
  optionPart,
  currentValue,
  title,
  unit,
  numberColor,
}) => {
  return (
    <div className="col-span-1 flex flex-col justify-center items-center bg-black p-8 h-full">
      {/* Option Part */}
      {optionPart && (
        <div className="flex items-center pb-4">
          <div className="text-white lg:text-5xl md:text-4xl sm:text-xl font-bold mr-4">
            {optionPart}
          </div>
        </div>
      )}
      {/* Current Value */}
      <div
        className="text-white font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl truncate"
        style={{ color: numberColor }}
      >
        {currentValue}
      </div>
      {/* Title and Unit */}
      <div
        className="relative top-0 left-0 text-white text-xs"
        style={{ color: numberColor }}
      >
        {title} {unit}
      </div>
    </div>
  );
};

export default ValueDisplay;
