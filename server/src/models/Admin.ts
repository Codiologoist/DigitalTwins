import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface AdminDocument extends Document {
  username: string;
  password: string;
  type: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: "admin" },
});

// Encrypt passwords using bcrypt
AdminSchema.pre<AdminDocument>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

// Compare the entered password with the stored hash password
AdminSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model<AdminDocument>("Admin", AdminSchema);
export default Admin;
