import { Router } from "express";
import * as userCtrl from "./user.ctrl";
import * as qrCtrl from "./qr.ctrl";

const router = Router();

// api/v3/register
router.post("/register", userCtrl.register);

// api/v3/login
router.post("/login", userCtrl.login);

// api/v3/facebook
router.post("/facebook", userCtrl.facebookLogin);

// api/v3/list
router.get("/list", userCtrl.getUsers);

// api/v3/qr/ckeck
router.get("/qr/check", qrCtrl.checkToken);

// api/v3/qr/token
router.post("/qr/token", qrCtrl.getToken);

export default router;
