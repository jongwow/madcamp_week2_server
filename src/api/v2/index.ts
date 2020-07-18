import { Router } from "express";
import * as userCtrl from "./user.ctrl";

const router = Router();
router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Hello World!", error: false });
});

// api/v2/login
router.post("/login", userCtrl.login);

// api/v2/list
router.get("/list", userCtrl.getUsers);

export default router;
