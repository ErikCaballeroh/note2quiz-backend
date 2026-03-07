import sharp from "sharp";

export const preprocessImage = async (buffer: Buffer): Promise<string> => {

    const processed = await sharp(buffer)
        .grayscale()
        .normalize()
        .sharpen()
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

    return processed.toString("base64");
};