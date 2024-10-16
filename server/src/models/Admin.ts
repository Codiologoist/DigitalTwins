import mongoose, { Schema, Document } from "mongoose";

interface AdminDocument extends Document {
  username: string;
  password: string; // We need to hash this password with something like bcrypt
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model<AdminDocument>("Admin", AdminSchema);
export default Admin;
