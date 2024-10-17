import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface DoctorDocument extends Document {
  firstName: string;
  lastName: string;
  SSN: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>; // Password comparison
}

const DoctorSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  SSN: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Encrypt passwords using bcrypt
DoctorSchema.pre<DoctorDocument>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next(); // If the password has not been modified, skip the encryption process

    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password with salt
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

// Compare the entered password with the stored hash password
DoctorSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model<DoctorDocument>("Doctor", DoctorSchema);
export default Doctor;
