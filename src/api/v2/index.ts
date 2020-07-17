import { Router } from "express";
import * as userCtrl from "./user.ctrl";

const router = Router();
router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Hello World!", error: false });
});

router.post("/login", userCtrl.login);

export default router;
