import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import streamingPlugin from "chartjs-plugin-streaming";
import "chartjs-adapter-date-fns";
import ValueDisplay from "./ValueDisplayComponent";

// import { RowData } from "../types/types";
Chart.register(streamingPlugin);

// Define the data point type
type ChartPoint = { x: number; y: number };

type RowComponentProps = {
  title: string;
  unit: string;
  color: string;
  numberColor: string;
  // Main data object containing arrays of timestamps, measurements, sample rates, and start time
  data: {
    time_vector: number[];
    measurement_data: number[];
    sample_rates: number[];
    start_time: number;
  };
  // Optional display data for a secondary value to show, such as HR value for ECG row
  valueDisplayData?: {
    time_vector: number[];
    measurement_data: number[];
    sample_rates: number[];
    start_time: number;
  };
  valueDisplayTitle?: string; // Optional title to display alongside the value (can be different from the main `title`)
  valueDisplayUnit?: string; // Optional unit to display for the value
  valueDisplayNumberColor?: string; // Optional color for displaying the value number
  optionPart?: React.ReactNode; // Optional part of the UI that can be passed as a React component node
};

const RowComponent: React.FC<RowComponentProps> = ({
  title, // The main title for the data display
  unit, // The unit of the measurement
  color, // The color for the chart
  numberColor, // The color for the displayed numeric value
  data, // The main data object
  optionPart, // Optional UI component to be rendered
  valueDisplayData, // Optional secondary display data for a specific value
  valueDisplayTitle, // Optional custom title for the displayed value
  valueDisplayUnit, // Optional custom unit for the displayed value
  valueDisplayNumberColor, // Optional custom color for the displayed value
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [alternateValue, setAlternateValue] = useState<number>(0);
  const animationFrameIdRef = useRef<number | null>(null); // Store requestAnimationFrame ID
  const startTimeRef = useRef<number | null>(null); // Track the time when HR updates start
  const lastBatchEndTimeRef = useRef<number | null>(null); // Track the end time of the previous HR batch
  const dataBufferRef = useRef<ChartPoint[]>([]); // Use useRef to persist dataBuffer

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
            ticks: {
              autoSkip: true, // Automatically skip ticks to avoid overlap
              maxRotation: 0, // Prevent rotation of labels
              minRotation: 0, // Prevent rotation of labels
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
    if (!chartInstanceRef.current) return; // Exit if the chart instance is not available

    const chart = chartInstanceRef.current;
    const dataset = chart.data.datasets[0];
    console.log("RowComponentProps.data", data);

    console.log("Plotting new data batch...");

    // Calculate variables needed for plotting in batches
    const batchIntervalMs = 100; // How often to plot a new batch in milliseconds (don't recommend reducing this due to DOM limitations)
    let avgSampleRate =
      data.sample_rates.reduce((a, b) => a + b, 0) / data.sample_rates.length;

    /* Due to backend latency (~470Ms), we need to draw faster than the actual sample rate to avoid
    building shadow latency between our system and the Moberg monitor.
    As long as the chart draws faster and then waits for the next fetch, problem is solved.
    Con to this approach is that the chart doesn't look as smooth.*/
    avgSampleRate += avgSampleRate * 0.475;

    const samplesPerBatch = Math.ceil((batchIntervalMs * avgSampleRate) / 1000); // Round up to avoid missing data (better to have more than less)
    const MAX_BUFFER_SIZE = 10 * avgSampleRate; // Buffer size is currently set to approx. 10s of data

    let currentIndex = 0;

    const plotBatch = () => {
      if (currentIndex >= data.time_vector.length) {
        // Exit if all points have been plotted
        console.log("All points plotted. Stopping updates.");
        return;
      }

      /* Update batchEndIndex to increment by samplesPerBatch, assign length of data.time_vector to batchEndIndex
      when currentIndex + samplesPerBatch is greater than data.time_vector.length (avoids out of bounds) */
      const batchEndIndex = Math.min(
        currentIndex + samplesPerBatch,
        data.time_vector.length
      );
      for (let i = currentIndex; i < batchEndIndex; i++) {
        const time = data.time_vector[i]; // Assign (UNIX Epoch milliseconds) timestamp to time const for the chart
        const value = data.measurement_data[i]; // Assign data point value to value const for the chart
        dataBufferRef.current.push({ x: time, y: value }); // Push the new data point (timestamp & value) to the buffer
      }

      while (dataBufferRef.current.length > MAX_BUFFER_SIZE) {
        dataBufferRef.current.shift(); // Remove old data points when buffer size exceeds the calculated maximum
      }

      dataset.data = dataBufferRef.current; // Update the dataset with the new data

      currentIndex = batchEndIndex; // Update the current index for next execution

      chart.update("quiet"); // Update the chart without animation

      const latestECGValue = data.measurement_data[currentIndex - 1];
      if (latestECGValue !== undefined) {
        setCurrentValue(latestECGValue);
      }

      // Schedule the next batch based on the interval
      if (currentIndex < data.time_vector.length) {
        setTimeout(plotBatch, batchIntervalMs);
      } else {
        console.log("All points for the current data run have been plotted.");
      }
    };

    plotBatch();
  }, [data]);

  useEffect(() => {
    // Ensure that valueDisplayData and its measurement_data exist before proceeding
    if (!valueDisplayData || !valueDisplayData.measurement_data) return;

    // Convert time_vector to absolute timestamps
    const absoluteTimes = valueDisplayData.time_vector.map(
      (t) => valueDisplayData.start_time + t
    );

    console.log("New data batch detected. Starting from index 0.");

    // Store the timestamp of the last value in the batch for reference
    lastBatchEndTimeRef.current = absoluteTimes[absoluteTimes.length - 1];
    // Calculate the average sample rate from the sample_rates array
    const valueAvgSampleRate =
      valueDisplayData.sample_rates.reduce((a, b) => a + b, 0) /
      valueDisplayData.sample_rates.length;
    const valueIntervalTime = 1000 / valueAvgSampleRate; // Time each HR should be displayed in milliseconds
    console.log("valueIntervalTime:", valueIntervalTime);

    startTimeRef.current = performance.now(); // Track when the value updates started

    // Function to update the value display at each animation frame
    const updateValue = () => {
      const elapsedTime = performance.now() - startTimeRef.current!; // Calculate how much time has passed
      const currentValueIndex = Math.floor(elapsedTime / valueIntervalTime); // Calculate which value should be displayed

      // If the current value index is valid, update the displayed value
      if (currentValueIndex < valueDisplayData.measurement_data.length) {
        const newValue = valueDisplayData.measurement_data[currentValueIndex];
        setAlternateValue(newValue); // Update the alternate value state variable to trigger a re-render
        console.log(
          "🐸 Updating HR to:",
          newValue,
          "at index:",
          currentValueIndex
        );
        animationFrameIdRef.current = requestAnimationFrame(updateValue); // Continue the animation loop by requesting the next frame
      } else {
        // Stop once the last HR value is displayed
        console.log("🐸 HR Update Complete. Displayed all HR values.");
        cancelAnimationFrame(animationFrameIdRef.current!);
      }
    };

    // Start animation frame loop
    animationFrameIdRef.current = requestAnimationFrame(updateValue);

    // Cleanup to stop animation when component unmounts
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current); // Cancel any remaining animation frames
      }
    };
  }, [valueDisplayData]); // Re-run this effect whenever valueDisplayData changes

  // Logic to display the custom (alternate value) only for ECG, RESP or PLETH,
  // otherwise show default measurement value**
  let displayValue = 0;
  if (title === "ECG" || title === "RESP,na" || title === "PLETH,na") {
    displayValue = alternateValue;
  } else {
    displayValue = currentValue;
  }

  return (
    <div className="grid grid-cols-3 items-start bg-black">
      {/* Left section: Chart display */}
      <div className="col-span-2 p-2 h-full">
        <canvas
          ref={chartRef}
          style={{ width: "100%", height: "200px" }}
        ></canvas>{" "}
        {/* Canvas for drawing the chart */}
      </div>
      {/* Right section: Value display component */}
      <ValueDisplay
        optionPart={optionPart}
        currentValue={displayValue} // Display the heart rate or general value based on title
        title={valueDisplayTitle ?? title} // Title to be displayed
        unit={valueDisplayUnit ?? unit} // Unit to be displayed alongside the value
        numberColor={valueDisplayNumberColor ?? numberColor} // Display color for the number
      />
    </div>
  );
};

export default RowComponent;
