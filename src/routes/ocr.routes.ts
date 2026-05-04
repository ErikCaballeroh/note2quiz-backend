import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { ocrFromImages } from "../controllers/ocr.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, upload.array("images", 10), ocrFromImages);

export default router;