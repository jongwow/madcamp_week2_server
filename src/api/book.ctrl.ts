import { RequestHandler } from "express";
import Book from "../models/book";

export const getBooks: RequestHandler = async (req, res, next) => {
  try {
    const books = await Book.find({}).exec();
    if (books.length === 0)
      return res.status(404).send({ err: "존재하지 않음" });
    return res.status(200).json({ msg: "정상", data: books });
  } catch (error) {
    console.error(`getTodos`);
    console.error(error);
  }
};

export const getBookById: RequestHandler = async (req, res, next) => {
  try {
    Book.findOne({ _id: req.params.book_id }, (err, book) => {
      if (err)
        return res.status(500).json({ msg: "에러 발생" + JSON.stringify(err) });
      if (!book) return res.status(404).json({ msg: "book 없음" });
      return res.status(200).json({ data: book });
    });
  } catch (error) {
    console.error(`getBooks`);
    console.error(error);
  }
};

export const insertBook: RequestHandler = async (req, res, next) => {
  try {
    const book = new Book();
    book.title = req.body.title;
    book.content = req.body.content;
    book.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "저장실패!" + JSON.stringify(err) });
      }
      return res.status(200).json({ msg: "저장성공" });
    });
  } catch (error) {
    console.error(error);
  }
};
