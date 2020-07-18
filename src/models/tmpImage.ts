import * as mongoose from "mongoose";

export interface ItmpImage extends mongoose.Document {
  fileName: String;
}
const tmpImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
});
const TmpImage = mongoose.model<ItmpImage>("TmpImage", tmpImageSchema);
export default TmpImage;
