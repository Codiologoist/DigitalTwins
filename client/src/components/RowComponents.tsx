import React from 'react'
import Plot from 'react-plotly.js';
import { RowData } from '../types';

// Defines the properties that the RowComponent will accept as props.
interface RowComponentProps extends RowData {}

// A reusable component that displays a graph and corresponding number indicator.
const RowComponent: React.FC<RowComponentProps> = ({ title, unit, color, numberColor, data, optionPart }) => {
    const currentValue = data.measurement_data[data.measurement_data.length - 1]; 
    // Get the latest measurement value

    return (
        <div className="grid grid-cols-3 items-start bg-black">{/* Main layout with 3 columns */}{/* Left side: Plotly graph */}
            <div className="col-span-2 p-2 h-full items-stretch"> {/* Takes 2 columns */}
                <Plot
                    data={[
                        {
                            x: data.time_vector,  // X-axis values (time)
                            y: data.measurement_data,  // Y-axis values (measurements)
                            type: "scatter",  // Type of graph
                            mode: "lines", // Connect points with lines
                            line: { color, width: 1.5}, // Line color to be determined by color props
                        },
                    ]}
                    layout={{ // Layout settings for the graph
                        title: "", // No title
                        xaxis: {
                            showticklabels: false, // Hide X-axis labels
                            color: "lime", // X-axis label color
                            zeroline: false, // Hide zero line
                        },
                        yaxis: {
                            showticklabels: false, // Hide Y-axis labels
                            color: "lime", // Y-axis label color
                            zeroline: false, // Hide zero line
                        },
                        plot_bgcolor: "black", // Background color of the plot
                        paper_bgcolor: "black", // Background color of the graph area font
                        font: {
                            color: "lime", // Font color
                        },
                        autosize: true, // Auto size the graph
                        margin: {
                            t: 50, // Top margin
                            r: 20, // Right margin
                            l: 10, // Left margin
                            b: 50 // Bottom margin
                        },
                    }}
                    useResizeHandler={true} // Handle resizing
                    style={{ width: "100%", height: "200px" }} // Style for the graph
                />
            </div>

            {/* Right side: number display */}
            <div className="col-span-1 flex flex-col justify-start items-center relative bg-black p-8 h-full"> {/* Takes 1 column */}
                {/* Optional standard values and current value */}
                <div className="flex items-center pt-12"> {/* Flex container for alignment */}
                    <div className="text-white lg:text-5xl md:text-4xl sm:text-xl font-bold mr-10">
                        {optionPart} {/* Display optional part (e.g., standard values) */}
                    </div>

                    {/* Current measurement number */}
                    <div className="text-white font-bold sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl truncate" style={{ color: numberColor }}>
                        {Math.round(currentValue)} {/* Round and display the latest measurement */}
                    </div>
                </div>

                {/* Unit in the top right corner */}
                <div className="absolute top-4 right-4 text-white text-xs p-6" style={{ color: numberColor }}>
                    {title} {unit} {/* Display title and unit */}
                </div>
            </div>
        </div>
    );
}

export default RowComponent; // Export the RowComponent