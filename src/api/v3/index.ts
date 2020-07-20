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

// api/v3/qr/
router.get("/qr", qrCtrl.scanQr);

// api/v3/check
router.post("/check", qrCtrl.check);

// api/v3/refresh
router.get("/refresh", qrCtrl.refreshToken);

export default router;
