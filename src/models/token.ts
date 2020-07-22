import * as mongoose from "mongoose";

interface IToken extends mongoose.Document {
  token: string;
  date: Date;
}

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  date: { type: Date, required: true },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
