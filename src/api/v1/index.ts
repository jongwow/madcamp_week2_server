import { Router } from "express";
import * as bookCtrl from "./book.ctrl";
import * as userCtrl from "./user.ctrl";

const router = Router();
router.get("/", (req, res, next) => {
  res.status(200).send("Hello World!");
});

router.get("/book", bookCtrl.getBooks);
router.get("/book/:book_id", bookCtrl.getBookById);
router.post("/book", bookCtrl.insertBook);

router.post("/user/test", userCtrl.test);
// router.post("/user/testLogin", userCtrl.testLogin);
router.post("/user/signup", userCtrl.signup);
router.post("/user/login", userCtrl.login);
router.post("/fbuser/login", userCtrl.fbLogin);
export default router;
