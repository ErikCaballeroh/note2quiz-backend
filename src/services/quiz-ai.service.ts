import { chunkText } from "../utils/textChunker"
import { conceptPrompt } from "../prompts/concept.prompt"
import { geminiModel } from "../config/gemini"
import { quizPrompt } from "../prompts/quiz.prompt"
import { QuizResponse } from "../types/quiz.types"

const extractConcepts = async (text: string): Promise<string[]> => {

    const result = await geminiModel.generateContent(
        conceptPrompt(text)
    )

    const response = result.response.text()

    const jsonMatch = response.match(/\{[\s\S]*\}/)

    if (!jsonMatch) return []

    const parsed = JSON.parse(jsonMatch[0])

    return parsed.concepts || []
}

const generateQuizFromConcepts = async (
    concepts: string[]
): Promise<QuizResponse> => {

    const result = await geminiModel.generateContent(
        quizPrompt(concepts)
    )

    const response = result.response.text()

    const jsonMatch = response.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
        throw new Error("Invalid JSON")
    }

    return JSON.parse(jsonMatch[0])
}

export const generateQuiz = async (text: string) => {

    const chunks = chunkText(text)

    let concepts: string[] = []

    for (const chunk of chunks) {

        const extracted = await extractConcepts(chunk)

        concepts = [...concepts, ...extracted]

        if (concepts.length >= 10) break
    }

    concepts = [...new Set(concepts)].slice(0, 10)

    return generateQuizFromConcepts(concepts)
}