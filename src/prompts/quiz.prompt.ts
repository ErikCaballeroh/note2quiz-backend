export const quizPrompt = (concepts: string[]) => `
Create a multiple choice quiz using the following study concepts.

Concepts:
${concepts.join("\n")}

Rules:
- Generate 5 questions
- Each question must have 4 options
- ONLY one option can have "isCorrect": true
- Do not include explanations
- Return JSON only
- Follow EXACTLY this format

{
  "title": "Quiz title",
  "questions": [
    {
      "question": "IP significa",
      "options": [
        { "text": "Internet Protocol", "isCorrect": true },
        { "text": "Internet Program", "isCorrect": false },
        { "text": "Internal Protocol", "isCorrect": false },
        { "text": "Input Process", "isCorrect": false }
      ]
    }
  ]
}

Return ONLY JSON.
`