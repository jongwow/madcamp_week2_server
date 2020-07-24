import { Router } from "express";
import * as userCtrl from "./user.ctrl";
import * as imageCtrl from "./image.ctrl";

import uploader from "../../lib/fileManager";

const router = Router();
router.get("/", (req, res, next) => {
  res.status(200).send("Hello World!");
});

router.get("/image", imageCtrl.getRandomImage);
router.get("/image/list", imageCtrl.getImageUrls);
router.post("/image/upload", uploader.single("img"), imageCtrl.uploadImage);
router.get("/image/:image_name", imageCtrl.getImageByName);
router.delete("/image/:image_name", imageCtrl.deleteImageByName);

router.post("/user/test", userCtrl.test);
// router.post("/user/testLogin", userCtrl.testLogin);
router.post("/user/signup", userCtrl.signup);
router.post("/user/login", userCtrl.login);
router.post("/fbuser/login", userCtrl.fbLogin);
export default router;
