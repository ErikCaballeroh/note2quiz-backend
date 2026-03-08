export const chunkText = (text: string, size = 2000) => {

    const chunks: string[] = []
    let index = 0

    while (index < text.length) {
        chunks.push(text.slice(index, index + size))
        index += size
    }

    return chunks
}