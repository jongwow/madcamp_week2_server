import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  salt: string;
  name: string;
  phone: string;
  facebook: number;
  id: string;
  lastChecked: Date;
  temperature: string;
  profileImage: string;
}
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, required: true },
  facebook: { type: Number, default: 0 },
  phone: { type: String, default: "010-0000-0000" },
  id: { type: String },
  lastChecked: { type: Date }, // 가장 최근에 출쳌한 날
  temperature: { type: String },
  profileImage: { type: String },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
