import { Router } from "express";
import uploader from "../../lib/fileManager";
import * as userCtrl from "./user.ctrl";
import * as qrCtrl from "./qr.ctrl";
import * as imageCtrl from "./image.ctrl";

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

// api/v3/
router.post("/image", uploader.single("img"), imageCtrl.uploadImage);
router.get("/image", imageCtrl.getImageUrls);
router.get("/image/:image_name", imageCtrl.getImageByName);

export default router;
