import * as mongoose from "mongoose";

export interface IProfileImage extends mongoose.Document {
  fileName: String;
}

const ProfileImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
});
const ProfileImage = mongoose.model<IProfileImage>(
  "ProfileImage",
  ProfileImageSchema
);
export default ProfileImage;
