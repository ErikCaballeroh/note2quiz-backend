import { Request, Response } from "express"
import { generateQuiz } from "../services/quiz-ai.service"
import { createQuiz } from "../services/quiz.service"

export const generateQuizController = async (
    req: Request,
    res: Response
) => {

    try {

        const { text } = req.body

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
            questions: generatedData.questions
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