import { Request, Response } from "express";
import { preprocessImage } from "../services/image.service";
import { runOCR } from "../services/ocr.service";
import { cleanText } from "../services/text.service";

export const ocrFromImages = async (req: Request, res: Response) => {

    try {

        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json({
                error: "No images uploaded"
            });
        }

        const results: string[] = [];

        for (const file of req.files) {

            const base64 = await preprocessImage(file.buffer);

            const rawText = await runOCR(base64);

            const cleaned = cleanText(rawText);

            results.push(cleaned);

        }

        const finalText = results.join("\n\n");

        res.json({
            ok: true,
            data: {
                pages: results.length,
                text: finalText
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            message: "OCR failed"
        });

    }

};