import React, { useEffect, useRef} from "react";

// Define the types for the props that the component will accept
type RowComponentProps = {
  title: string;          // The title of the row component
  unit: string;           // The unit for the measurement data (e.g., "ms", "Hz")
  color: string;          // The color used to draw the wave
  numberColor: string;    // The color of the current value text
  data: {                 // Data object containing time vector, measurement data, sample rates, and start time
    time_vector: number[];  // Array of timestamps
    measurement_data: number[]; // Array of measurement data points (e.g., wave values)
    sample_rates: number[]; // Array of sample rates
    start_time: number;     // The start time of the measurement in milliseconds
  };
  optionPart?: React.ReactNode; // Optional additional content to display in the value section
};

const RowComponent: React.FC<RowComponentProps> = ({
  title,
  unit,
  color,
  numberColor,
  data,
  optionPart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  // Reference for the canvas element
  const animationRef = useRef<number | null>(null);  // Reference for the animation frame ID
  const [timeStamp, setTimeStamp] = React.useState<number>(0);  // State to store the timestamp (time elapsed since start)

  useEffect(() => {
    // Initialize the canvas and get the drawing context
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is not available.");
      return;
    }

    const width = canvas.width;  // Canvas width
    const height = canvas.height;  // Canvas height

    // Calculate the sampling interval
    const sampleRate = data.sample_rates[0];
    const interval = 1 / sampleRate;  // Time interval between each data point in seconds
    const waveData = data.measurement_data;  // The actual measurement data (wave data)

    let currentStartTime = performance.now();  // Get the current timestamp when the animation starts
    const realStartTime = data.start_time;  // Start time of the data in milliseconds
    let passedTime = 0;  // The time elapsed since the animation started

    // Function to draw the wave on the canvas
    const drawWave = (currentTimestamp: number) => {
      if (!canvas || !ctx) return;

      // Calculate the time passed since the start of the animation
      passedTime = (currentTimestamp - currentStartTime) / 1000;  // Convert to seconds

      // Update the timestamp state (real start time plus passed time)
      setTimeStamp(realStartTime / 1000 + passedTime * 1000);  // Adjust to milliseconds

      // Clear the canvas before drawing the new wave
      ctx.clearRect(0, 0, width, height);

      // Determine how many data points need to be drawn
      const pointsToDraw = Math.min(
        Math.floor(passedTime / interval),
        waveData.length
      );

      // Begin drawing the wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);  // Start from the middle of the canvas

      const mapWidthRate = 3.7;  // Scaling factor for the wave width
      for (let i = 0; i < pointsToDraw; i++) {
        const y = height / 2 - waveData[i] * (height / 4);  // Map the data point to the canvas height
        const x = (i / waveData.length) * width * mapWidthRate;  // Map the data point to the canvas width
        ctx.lineTo(x, y);  // Draw a line to the next data point
      }

      ctx.strokeStyle = color;  // Set the stroke color for the wave
      ctx.lineWidth = 2;  // Set the line width
      ctx.stroke();  // Actually draw the wave on the canvas

      // Reset the animation when all data points have been drawn
      if (pointsToDraw >= waveData.length) {
        currentStartTime = currentTimestamp;  // Reset the start time
        passedTime = 0;
      } else {
        animationRef.current = requestAnimationFrame(drawWave);  // Request the next frame for animation
      }
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(drawWave);

    // Clean up the animation when the component is unmounted
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color]);

  // Get the current value from the last data point
  const currentValue = data.measurement_data[data.measurement_data.length - 1] || 0;

  // Function to format the timestamp into a readable date and time string
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();  // Get the full year
    const month = (date.getMonth() + 1).toString().padStart(2, "0");  // Get the month (0-11), add 1 and format
    const day = date.getDate().toString().padStart(2, "0");  // Get the day and format
    const hours = date.getHours().toString().padStart(2, "0");  // Get the hours and format
    const minutes = date.getMinutes().toString().padStart(2, "0");  // Get the minutes and format
    const seconds = date.getSeconds().toString().padStart(2, "0");  // Get the seconds and format

    // Calculate milliseconds and format to two decimal places
    const milliseconds = (timestamp % 1000) / 1000;
    const formattedMilliseconds = milliseconds.toFixed(2).slice(2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${formattedMilliseconds}`;
  };

  // Format the timestamp into a readable string
  const formattedTime = formatTime(timeStamp);

  return (
    <div className="grid grid-cols-3 items-start bg-black">
      {/* Title Section */}
      <div className="col-span-3 text-[#90EE90] text-left lg:text-2xl md:text-2xl sm:text-xl font-bold py-4 pl-5">
        {title}
      </div>

      {/* Chart Area */}
      <div className="col-span-2 p-2 h-full">
        <canvas
          ref={canvasRef}  // Bind the canvas reference
          width={800}  // Set the width of the canvas
          height={200}  // Set the height of the canvas
          style={{ width: "100%", height: "200px" }}  // Set the style for the canvas
        ></canvas>

        {/* Display the formatted timestamp */}
        <div className="text-white text-center font-bold">
          {formattedTime}
        </div>
      </div>

      {/* Value Display Section */}
      <div className="col-span-1 flex flex-col justify-center items-center bg-black p-8 h-full">
        {/* Option Part */}
        {optionPart && (
          <div className="flex items-center pb-4">
            <div className="text-white lg:text-5xl md:text-4xl sm:text-xl font-bold mr-4">
              {optionPart}
            </div>
          </div>
        )}
        {/* Display the current value */}
        <div
          className="text-white font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl truncate"
          style={{ color: numberColor }}
        >
          {Math.round(currentValue)}
        </div>
        {/* Title and Unit */}
        <div
          className="absolute top-4 right-4 text-white text-xs"
          style={{ color: numberColor }}
        >
          {title} {unit}
        </div>
      </div>
    </div>
  );
};

export default RowComponent;
