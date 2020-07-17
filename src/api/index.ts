import { Router } from "express";
import * as bookCtrl from "./book.ctrl";
import app from "../server";

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).send("Hello World!");
});

router.get("/book", bookCtrl.getBooks);
router.get("/book/:book_id", bookCtrl.getBookById);
router.post("/book", bookCtrl.insertBook);
export default router;
