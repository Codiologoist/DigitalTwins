// Defines the structure of the data used for rendering the graph in the RowComponent.
export interface DataType {
    time_vector: number[];
    measurement_data: number[];
}

// Defines the general structure for the data contains different patient measurement data
export interface AllDataType {
    ["ABP,Dias"]: DataType,
    ["ABP,Mean"]: DataType,
    ["ABP,Syst"]: DataType,
    ["HR,na"]: DataType,
    ["RR,na"]: DataType,
    ["SpO2,na"]: DataType,
    ["Tvesic,na"]: DataType,
    ["rSO2,Left"]: DataType,
    ["rSO2,Right"]: DataType,
    // Add more data types if needed 
}

export interface RowData {
    title: string; // Title of the measurement (e.g., "HR", "ABP")
    unit: string; // Unit of measurement (e.g., "bpm", "mmHg")
    color: string; // Color for the graph line
    numberColor: string; // Color for the displayed number
    data: { // Structure of the data being passed
        time_vector: number[]; // Array of time points
        measurement_data: number[]; // Array of measurement values
    };
    optionPart?: React.ReactNode; // Optional additional content (can be string or JSX)
}

export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
}