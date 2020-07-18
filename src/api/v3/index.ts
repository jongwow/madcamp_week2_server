import { Router } from "express";
import * as userCtrl from "./user.ctrl";

const router = Router();

// api/v3/register
router.post("/register", userCtrl.register);

// api/v3/login
router.post("/login", userCtrl.login);

// api/v3/facebook
router.post("/facebook", userCtrl.facebookLogin);

export default router;
