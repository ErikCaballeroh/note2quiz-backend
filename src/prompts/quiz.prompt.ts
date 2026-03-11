export const quizPrompt = (text: string) => `
Create a multiple choice quiz using ONLY the information from the following study notes.

Notes:
${text}

Rules:
- Generate 5 questions (or fewer if there is not enough information)
- Each question must have 4 options
- ONLY one option can have "isCorrect": true
- Do not include explanations
- Do NOT use outside knowledge or hallucinate questions that are not related to the notes provided
- MUST return the result in the same language as the notes (preferably Spanish)
- Return JSON only
- Follow EXACTLY this format

{
  "title": "Título del Quiz",
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