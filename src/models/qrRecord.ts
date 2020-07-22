import * as mongoose from "mongoose";

interface IQrRecord extends mongoose.Document {
  userId: string;
  token: string;
  date: Date;
}

const qrRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  date: { type: Date, required: true },
});

const QrRecord = mongoose.model<IQrRecord>("QrRecord", qrRecordSchema);
export default QrRecord;
