export const cleanText = (text: string): string => {

    return text
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[^\wáéíóúÁÉÍÓÚñÑ.,()\- ]+/g, "")
        .trim();
};