import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { ocrFromImages } from "../controllers/ocr.controller";

const router = Router();

router.post("/", upload.array("images", 10), ocrFromImages);

export default router;