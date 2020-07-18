import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  salt: string;
  name: string;
  phone: string;
  facebook: number;
  id: string;
}
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, required: true },
  facebook: { type: Number, default: 0 },
  phone: { type: String, default: "010-0000-0000" },
  id: { type: String },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
