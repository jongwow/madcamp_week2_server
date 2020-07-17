import * as mongoose from "mongoose";

// interface prefix로 I를 붙이는 건 안좋은 스타일이지만 킹단 한다.
export interface IBook extends mongoose.Document {
  title: String;
  content: String;
  completed: Boolean;
}

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Book = mongoose.model<IBook>("Book", bookSchema);
export default Book;
