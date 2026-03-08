import { Request, Response } from "express"
import { generateQuiz } from "../services/quiz-ai.service"

export const generateQuizController = async (
    req: Request,
    res: Response
) => {

    try {

        const { text } = req.body

        if (!text) {
            return res.status(400).json({
                error: "text is required"
            })
        }

        const quiz = await generateQuiz(text)

        res.json(quiz)

    } catch (error) {

        console.error(error)

        res.status(500).json({
            error: "quiz generation failed"
        })

    }

}   