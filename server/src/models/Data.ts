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
    ["ABP,Dias"]: mongoose.Types.ObjectId[],
    ["ABP,Mean"]: mongoose.Types.ObjectId[],
    ["ABP,Syst"]: mongoose.Types.ObjectId[],
    ["HR,na"]: mongoose.Types.ObjectId[],
    ["RR,na"]: mongoose.Types.ObjectId[],
    ["SpO2,na"]: mongoose.Types.ObjectId[],
    ["Tvesic,na"]: mongoose.Types.ObjectId[],
    ["rSO2,Left"]: mongoose.Types.ObjectId[],
    ["rSO2,Right"]: mongoose.Types.ObjectId[],
    // Add more data types if needed 
}

const AllDataTypeSchema: Schema = new Schema({
    ["ABP,Dias"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["ABP,Mean"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["ABP,Syst"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["HR,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["RR,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data", 
        required: true 
    },
    ["SpO2,na"]: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["Tvesic,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["rSO2,Left"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data", 
        required: true 
    },
    ["rSO2,Right"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    // Add more data types if needed 
});

export interface DataTypes {
  ["ABP,Dias"]: PatientData;
  ["ABP,Mean"]: PatientData;
  ["ABP,Syst"]: PatientData;
  ["HR,na"]: PatientData;
  ["RR,na"]: PatientData;
  ["SpO2,na"]: PatientData;
  ["Tvesic,na"]: PatientData;
  ["rSO2,Left"]: PatientData;
  ["rSO2,Right"]: PatientData;
  // Add more data types if needed 
}

const Data = mongoose.model<PatientData>("Data", DataSchema);
const AllData = mongoose.model<AllDataType>("AllData", AllDataTypeSchema);
export { Data, AllData, AllDataTypeSchema };