import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const clarifai = new OpenAI({
    apiKey: process.env.CLARIFAI_PAT,
    baseURL: "https://api.clarifai.com/v2/ext/openai/v1"
});

export const OCR_MODEL =
    "https://clarifai.com/deepseek-ai/deepseek-ocr/models/DeepSeek-OCR";