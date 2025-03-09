import { Request, Router } from "express";
import multer from "multer";
import { upload } from "../middlewares/multer_file_upload_middleware";
import { uploadCSV } from "../controllers/uploadController";

const router = Router();

router.post("/upload", upload.single("file"), uploadCSV);

export default router;
