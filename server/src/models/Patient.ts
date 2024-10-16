import mongoose, { Schema, Document } from "mongoose";

// Define the data type interface PatientData
export interface PatientData {
  data_qual_str: string[];
  data_qual_time: number[];
  measurement_data: number[];
  start_date_time: string;
  time_vector: number[];
  units: string[];
}

// Defines the Document extension for Mongoose
interface PatientDocument extends Document, PatientData {}

// Define Mongoose Schema
const PatientSchema: Schema = new Schema({
  data_qual_str: { type: [String], required: true },
  data_qual_time: { type: [Number], required: true },
  measurement_data: { type: [Number], required: true },
  start_date_time: { type: String, required: true },
  time_vector: { type: [Number], required: true },
  units: { type: [String], required: true },
});

const Patient = mongoose.model<PatientDocument>("Patient", PatientSchema);
export default Patient;
