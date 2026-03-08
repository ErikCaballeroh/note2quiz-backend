export const conceptPrompt = (text: string) => `
Extract the most important study concepts from the following notes.

Rules:
- Maximum 5 concepts
- Each concept must be short
- Focus on important ideas

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