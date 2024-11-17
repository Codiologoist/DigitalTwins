import mongoose, { Schema, Document } from "mongoose";

// Define the data type interface PatientData

export interface DataRun {
  samples: number[];
  timestamps: number[];
  num_samples: number;
  duration: number;
  sample_rate: number;
  sample_interval: number;
  start_time: number;
}

const DataRunSchema: Schema = new Schema({
  samples: { type: [Number], required: true },
  timestamps: { type: [Number], required: true },
  num_samples: { type: Number, required: true },
  duration: { type: Number, required: true },
  sample_rate: { type: Number, required: true },
  sample_interval: { type: Number, required: true },
})
export interface PatientData extends Document {
  signal_type: string;
  data: DataRun[];
  patient_first_name: string;
  patient_last_name: string;
  admission_time: number;
}

const DataSchema: Schema = new Schema({
  signal_type: { type: String, required: true },
  data: { type: [DataRunSchema], required: true },
  patient_first_name: { type: String, required: true },
  patient_last_name: { type: String, required: true },
  admission_time: { type: Number, required: true }
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
    ["CO2,na"]: mongoose.Types.ObjectId[],
    ["ABP,na"]: mongoose.Types.ObjectId[],
    ["ECG,II"]: mongoose.Types.ObjectId[],
    ["PLETH,na"]: mongoose.Types.ObjectId[],
    ["RESP,na"]: mongoose.Types.ObjectId[],
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
    ["CO2,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["ABP,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["ECG,II"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["PLETH,na"]: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true 
    },
    ["RESP,na"]: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Data",
        required: true
    }
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
  ["CO2,na"]: PatientData;
  ["ABP,na"]: PatientData;
  ["ECG,II"]: PatientData;
  ["PLETH,na"]: PatientData;
  ["RESP,na"]: PatientData;
  // Add more data types if needed 
}

const Data = mongoose.model<PatientData>("Data", DataSchema);
const AllData = mongoose.model<AllDataType>("AllData", AllDataTypeSchema);
export { Data, AllData, AllDataTypeSchema };