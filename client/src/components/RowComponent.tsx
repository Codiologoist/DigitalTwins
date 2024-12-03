import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import streamingPlugin from "chartjs-plugin-streaming";
import "chartjs-adapter-date-fns";

// import { RowData } from "../types/types";
Chart.register(streamingPlugin);

// Define the data point type
type ChartPoint = { x: number; y: number };

// Create number buffer
const dataBuffer: ChartPoint[] = [];

type RowComponentProps = {
  title: string;
  unit: string;
  color: string;
  numberColor: string;
  data: {
    time_vector: number[];
    measurement_data: number[];
    sample_rates: number[];
    start_time: number;
  };
  optionPart?: React.ReactNode;
};

const RowComponent: React.FC<RowComponentProps> = ({
  title,
  unit,
  color,
  numberColor,
  data,
  optionPart,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // State to keep track of the last plotted time
  const [firstTimestamp, setFirstTimestamp] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check if the chartRef (canvas element) is available
    if (!chartRef.current) {
      console.error("Canvas element is not found.");
      return;
    }
    // Get the 2D drawing context from the chartRef/canvas element
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is not available.");
      return;
    }

    // Initialize a Chart.js instance with a real time x-axis
    chartInstanceRef.current = new Chart(ctx, {
      type: "line", // Define chart type as a line chart
      data: {
        labels: [], // Initialize empty labels for X-axis as timestamps will be added dynamically
        datasets: [
          {
            label: title, // Set title
            borderColor: color, // Set the line color using the provided color prop
            backgroundColor: "rgba(0, 255, 0, 0.2)", // Set a background color with some transparency
            borderWidth: 2, // Set the thickness of the line
            data: [], // Start with an empty dataset

            pointRadius: 0, // Hides the points completely (or set to a very small number)
            pointBorderWidth: 0, // No border for points
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false,
        animation: false, // Disable animation for smoother real-time updates
        scales: {
          x: {
            type: "time", // Use a time scale for the X-axis
            time: {
              unit: "second", // Display in second
              tooltipFormat: "HH:mm:ss", // Format the tooltip to show time
            },
            title: {
              display: true, // Display a title for the X-axis
              text: "Time (s)", // Set the title text for the X-axis
            },
          },
          y: {
            beginAtZero: false, // Ensure the Y-axis starts at zero
            ticks: {
              color: "lime", // Set tick color
            },
          },
        },
      },
    });
    //  Destroy the chart instance when the component is unmounted
    return () => {
      chartInstanceRef.current?.destroy(); // Destroy the chart to free up resources
      chartInstanceRef.current = null; // Reset the chart reference
    };
  }, [title, color]); // Dependencies array: run this effect when title or color change

  // Update the chart when data changes
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;
    const dataset = chart.data.datasets[0];
    console.log("RowComponentProps.data", data);

    // Convert `time_vector` to UNIX timestamps
    let startTimestamp = data.start_time;
    startTimestamp = startTimestamp / 1000; // Convert it to milliseconds

    //TODO: Change pausing to work based off first timestamp in data.time_vector instead
    // Check if the new data is stale and the last dataset hash
    if (lastPlottedTime !== null && startTimestamp <= lastPlottedTime) {
      console.log("No new data available. Pausing plotting...");
      setIsPaused(true);
      return; // No new data, so stop processing this batch
    } else {
      console.log("New data available. Resuming plotting...");
      setIsPaused(false);
      setLastPlottedTime(startTimestamp); // Update the last plotted time
    }

    // Calculate the batch size for updates
    const batchIntervalMs = 50; // Update every 50ms
    const avgSampleRate =
      data.sample_rates.reduce((a, b) => a + b, 0) / data.sample_rates.length;
    const samplesPerBatch = Math.ceil((batchIntervalMs * avgSampleRate) / 1000); // Calculate the number of samples per batch

    const MAX_BUFFER_SIZE = 15 * avgSampleRate; // Buffer size is approx. 15 seconds

    let currentIndex = 0;

    const plotBatch = () => {
      if (isPaused || currentIndex >= data.time_vector.length) {
        console.log("Paused or all points plotted. Stopping updates.");
        return;
      }

      // Update batchEndIndex to increment by samplesPerBatch, assign length of data.time_vector to batchEndIndex
      // when currentIndex + samplesPerBatch is greater than data.time_vector.length (avoid out of bounds error)
      const batchEndIndex = Math.min(
        currentIndex + samplesPerBatch,
        data.time_vector.length
      );
      for (let i = currentIndex; i < batchEndIndex; i++) {
        const time = startTimestamp + data.time_vector[i]; // Convert to ms
        const value = data.measurement_data[i];
        // dataset.data.push({ x: time, y: value });
        dataBuffer.push({ x: time, y: value });
      }

      while (dataBuffer.length > MAX_BUFFER_SIZE) {
        dataBuffer.shift();
      }

      dataset.data = dataBuffer; // Update the dataset with the new data

      currentIndex = batchEndIndex; // Update the current index for next execution

      chart.update("quiet"); // Update the chart without animation

      // Schedule the next batch
      if (currentIndex < data.time_vector.length) {
        setTimeout(plotBatch, batchIntervalMs);
      } else {
        console.log("All points for the current data run have been plotted.");
        setIsPaused(true); // Pause if all points are plotted
      }
    };

    plotBatch();
  }, [data, isPaused, firstTimestamp]);

  const currentValue =
    data.measurement_data[data.measurement_data.length - 1] || 0;

  return (
    <div className="grid grid-cols-3 items-start bg-black">
      {/* Chart Area */}
      <div className="col-span-2 p-2 h-full">
        <canvas
          ref={chartRef}
          style={{ width: "100%", height: "200px" }}
        ></canvas>
      </div>

      {/* Value Display */}
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
