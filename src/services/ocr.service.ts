import { clarifai, OCR_MODEL } from "../config/clarifai";

export const runOCR = async (base64Image: string): Promise<string> => {
    let retries = 3;
    let lastError: any;

    while (retries > 0) {
        try {
            const response = await clarifai.chat.completions.create({
                model: OCR_MODEL,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `
                                    Extract all text visible in the image.

                                    If a word is unreadable write [?].

                                    Return only the extracted text.
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
        } catch (error) {
            console.error(`OCR attempt failed. Retries left: ${retries - 1}`, error);
            lastError = error;
            retries--;
            if (retries > 0) {
                // Wait for 2 seconds before retrying (model cold start)
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    throw lastError;
};