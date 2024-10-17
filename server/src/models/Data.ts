import mongoose, { Schema, Document } from "mongoose";

// Define the data type interface PatientData
export interface PatientData extends Document {
  data_qual_str: string[];
  data_qual_time: number[];
  measurement_data: number[];
  start_date_time: string;
  time_vector: number[];
  units: string[];
  full_name: string;
}

const DataSchema: Schema = new Schema({
  data_qual_str: { 
    type: [String], 
    required: true 
  },
  data_qual_time: { 
    type: [Number], 
    required: true 
  },
  measurement_data: { 
    type: [Number], 
    required: true 
  },
  start_date_time: { 
    type: String, 
    required: true,
    unique: true
  },
  time_vector: { 
    type: [Number], 
    required: true 
  },
  units: { 
    type: [String], 
    required: true 
  },
  full_name: { 
    type: String, 
    required: true 
  }
});

export interface AllDataType extends Document{
    ["ABP,Dias"]: PatientData[],
    ["ABP,Mean"]: PatientData[],
    ["ABP,Syst"]: PatientData[],
    ["HR,na"]: PatientData[],
    ["RR,na"]: PatientData[],
    ["SpO2,na"]: PatientData[],
    ["Tvesic,na"]: PatientData[],
    ["rSO2,Left"]: PatientData[],
    ["rSO2,Right"]: PatientData[],
    // Add more data types if needed 
}

const AllDataTypeSchema: Schema = new Schema({
    ["ABP,Dias"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["ABP,Mean"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["ABP,Syst"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["HR,na"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["RR,na"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["SpO2,na"]: {
        type: [DataSchema], 
        required: true 
    },
    ["Tvesic,na"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["rSO2,Left"]: { 
        type: [DataSchema], 
        required: true 
    },
    ["rSO2,Right"]: { 
        type: [DataSchema], 
        required: true 
    },
    // Add more data types if needed 
});

const Data = mongoose.model<PatientData>("Data", DataSchema);
const AllData = mongoose.model<AllDataType>("AllData", AllDataTypeSchema);
export { Data, AllData, AllDataTypeSchema };