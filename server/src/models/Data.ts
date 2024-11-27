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

export interface DataTypes {
  ["ABP,Dias"]: typeof Data;
  ["ABP,Mean"]: typeof Data;
  ["ABP,Syst"]: typeof Data;
  ["HR,na"]: typeof Data;
  ["RR,na"]: typeof Data;
  ["SpO2,na"]: typeof Data;
  ["Tvesic,na"]: typeof Data;
  ["rSO2,Left"]: typeof Data;
  ["rSO2,Right"]: typeof Data;
  ["CO2,na"]: typeof Data;
  ["ABP,na"]: typeof Data;
  ["ECG,II"]: typeof Data;
  ["PLETH,na"]: typeof Data;
  ["RESP,na"]: typeof Data;
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
  });
  

  export interface DataTypes {
    ["ABP,Dias"]: typeof Data;
    ["ABP,Mean"]: typeof Data;
    ["ABP,Syst"]: typeof Data;
    ["HR,na"]: typeof Data;
    ["RR,na"]: typeof Data;
    ["SpO2,na"]: typeof Data;
    ["Tvesic,na"]: typeof Data;
    ["rSO2,Left"]: typeof Data;
    ["rSO2,Right"]: typeof Data;
    ["CO2,na"]: typeof Data;
    ["ABP,na"]: typeof Data;
    ["ECG,II"]: typeof Data;
    ["PLETH,na"]: typeof Data;
    ["RESP,na"]: typeof Data;
    // Add more data types if needed 
  }
  

const Data = mongoose.model<PatientData>("Data", DataSchema);
const AllData = mongoose.model<DataTypes>("AllData", AllDataTypeSchema);
export { Data, AllData, AllDataTypeSchema };