import { Request, Response } from "express"
import { generateQuiz } from "../services/quiz-ai.service"
import { createQuiz } from "../services/quiz.service"

const parseOptionalCategoryId = (value: unknown) => {
    if (value === undefined || value === null) {
        return value;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        throw new Error("categoryId inválido")
    }

    return parsedValue
}

export const generateQuizController = async (
    req: Request,
    res: Response
) => {

    try {

        const { text, categoryId } = req.body
        const normalizedCategoryId = parseOptionalCategoryId(categoryId)

        if (!text) {
            return res.status(400).json({
                ok: false,
                message: "text is required"
            })
        }

        const generatedData = await generateQuiz(text)

        // Save immediately to DB to retrieve by ID later
        const savedQuiz = await createQuiz(Number(req.userId), {
            title: generatedData.title,
            sourceText: text,
            questions: generatedData.questions,
            categoryId: normalizedCategoryId
        })

        res.json({
            ok: true,
            data: savedQuiz
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            ok: false,
            message: "quiz generation failed"
        })

    }

}