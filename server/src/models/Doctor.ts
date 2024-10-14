import mongoose, { Schema, Document } from "mongoose";

interface DoctorDocument extends Document {
  name: string;
  lastName: string;
  SSN: string;
  username: string;
  password: string;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  SSN: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Doctor = mongoose.model<DoctorDocument>("Doctor", DoctorSchema);
export default Doctor;
