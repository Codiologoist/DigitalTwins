import mongoose, { Schema, Document } from "mongoose";
import { AllDataType, AllDataTypeSchema } from "./Data";

// Define the data type interface PatientData
export interface PatientDocument extends Document {
  name: {
    firstName: string;
    lastName: string;
  },
  SSN: string,
  data: AllDataType,
  path: string
}

// Define Mongoose Schema
const PatientSchema: Schema = new Schema({
  firstName: {
      type: String,
      maxlength: 50,
  },
  lastName: {
      type: String,
      maxlength: 50,
  },
  SSN: {
    type: String,
    required: true,
    unique: true,
    maxlength: 12,
    minlength: 12
  },
  data: {
    type: AllDataTypeSchema,
  },
  path: {
    type: String,
    required: true
  }
});

const Patient = mongoose.model<PatientDocument>("Patient", PatientSchema);
export default Patient;