import { Router } from "express";
import { checkStatus } from "../controllers/statusController";

const router = Router();

router.get("/status/:requestId", checkStatus);

export default router;