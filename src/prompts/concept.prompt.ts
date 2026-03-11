export const conceptPrompt = (text: string) => `
Extract the most important study concepts from the following notes.

Rules:
- Maximum 5 concepts
- Each concept must be short
- Focus strictly on the important ideas presented in the text
- Do NOT use outside knowledge or hallucinate information
- If the text is empty, incomprehensible, or lacks study material, return an empty array []
- MUST return the result in the same language as the notes (preferably Spanish)

Return JSON only:

{
 "concepts": [
  "concept 1",
  "concept 2"
 ]
}

Notes:
${text}
`