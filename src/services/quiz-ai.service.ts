import { geminiModel } from "../config/gemini"
import { quizPrompt } from "../prompts/quiz.prompt"
import { QuizResponse } from "../types/quiz.types"

export const generateQuiz = async (text: string): Promise<QuizResponse> => {

    const result = await geminiModel.generateContent(
        quizPrompt(text)
    )

    const response = result.response.text()

    const jsonMatch = response.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
        throw new Error("Invalid JSON")
    }

    return JSON.parse(jsonMatch[0])
}