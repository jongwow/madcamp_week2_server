import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  level: Number; // 1: 학생, 5: 운영자
  name: String;
  email: String;
  password: String;
  // facebookId:String;
  // imageUrl: String;
  // StudentId : String
  // HP: String;
}
const userSchema = new mongoose.Schema({
  level: { type: Number, default: 1 },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});
const User = mongoose.model<IUser>("User", userSchema);
export default User;
