export interface QuizOption {
    text: string
    isCorrect: boolean
}

export interface QuizQuestion {
    question: string
    options: QuizOption[]
}

export interface QuizResponse {
    title: string
    questions: QuizQuestion[]
}