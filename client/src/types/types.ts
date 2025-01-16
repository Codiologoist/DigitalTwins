// Defines the structure of the data used for rendering the graph in the RowComponent.
export interface DataType {
  duration: number;
  num_samples: number;
  sample_interval: number;
  sample_rate: number;
  samples: number[]; // Array of sample values
  start_time: number;
  timestamps: number[];
  unit: string;
}

// Represents processed data for a single signal
export interface ProcessedDataType {
  time_vector: number[]; // Flattened timestamps (processed)
  measurement_data: number[]; // Flattened samples (processed)
  sample_rates: number[];
  start_time?: number;
  data?: DataType[];
}

// Defines the general structure for the data contains different patient measurement data
export interface AllDataType {
  ["ECG,II"]: ProcessedDataType;
  ["ABP,na"]: ProcessedDataType;
  ["RESP,na"]: ProcessedDataType;
  // ["ABP,Dias"]: ProcessedDataType,
  // ["ABP,Mean"]: ProcessedDataType,
  // ["ABP,Syst"]: ProcessedDataType,
  ["HR,na"]: ProcessedDataType;
  ["RR,na"]: ProcessedDataType;
  ["SpO2,na"]: ProcessedDataType;
  ["PLETH,na"]: ProcessedDataType;
  // ["Tvesic,na"]: ProcessedDataType,
  // ["rSO2,Left"]: ProcessedDataType,
  // ["rSO2,Right"]: ProcessedDataType,
  // Add more data types if needed
}

export interface RowData {
  title: string; // Title of the measurement (e.g., "HR", "ABP")
  unit: string; // Unit of measurement (e.g., "bpm", "mmHg")
  color: string; // Color for the graph line
  numberColor: string; // Color for the displayed number
  data: {
    // Structure of the data being passed
    time_vector: number[]; // Array of time points
    measurement_data: number[]; // Array of measurement values
    sample_rates: number[];
    start_time: number;
  };
  optionPart?: React.ReactNode; // Optional additional content (can be string or JSX)
  valueDisplayData?: {
    time_vector: number[];
    measurement_data: number[];
    sample_rates: number[];
    start_time: number;
  };
  valueDisplayTitle?: string;
  valueDisplayUnit?: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  SSN: string;
  path: string;
}

export interface NavigationLink {
  name: string;
  href: string;
  current: boolean;
}
