import { Router } from "express";
import v1 from "./v1";
import v2 from "./v2";
import v3 from "./v3";

const router = Router();

router.use("/v1", v1);
router.use("/v2", v2);
router.use("/v3", v3);

export default router;
