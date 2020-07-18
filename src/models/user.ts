import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  salt: string;
  name: string;
  facebook: number;
}
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, required: true },
  facebook: { type: Number, default: 0 },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;