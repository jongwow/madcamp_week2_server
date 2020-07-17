import * as mongoose from "mongoose";

export interface IFbUser extends mongoose.Document {
  name: String;
  email: String;
  id: String;
  // imageUrl: String;
  // StudentId : String
  // H.P: String;
}
const fbUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  id: { type: String, required: true, unique: true },
});
const FbUser = mongoose.model<IFbUser>("FbUser", fbUserSchema);
export default FbUser;
