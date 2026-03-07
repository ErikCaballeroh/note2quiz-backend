import { clarifai, OCR_MODEL } from "../config/clarifai";

export const runOCR = async (base64Image: string): Promise<string> => {

    const response = await clarifai.chat.completions.create({
        model: OCR_MODEL,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
                        You are an OCR engine.

                        Extract the text EXACTLY as it appears in the image.

                        Rules:
                        - Do not summarize
                        - Do not generate text
                        - Do not repeat text
                        - If text is unreadable write [?]
                        - Preserve original language

                        Return ONLY the extracted text.
                        `
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ]
            }
        ],
        temperature: 0,
        max_tokens: 2000
    });

    return response.choices[0].message.content ?? "";
};