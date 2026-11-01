import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { SolvedProblems, ExcludedProblems } = await req.json();

    const prompt = `
    You are a LeetCode mentor.
    
    Solved problems:
    ${SolvedProblems.join(", ")}
    
    Previously suggested (DO NOT repeat):
${ExcludedProblems?.join(", ") || "None"}

TASK:
- Recommend EXACTLY 5 NEW LeetCode problems
- Must be similar in concept and difficulty
- Must NOT repeat solved or previous suggestions

STRICT RULES:
- Do NOT repeat ANY from either list
- All 5 must be different
- Return ONLY valid JSON
- No explanation

FORMAT:
{
  "suggestions": [
    {
      "title": "Problem name",
      "difficulty": "Easy | Medium | Hard",
      "concept": "Main concept tested"
      }
      ]
      }
      `;
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });
    const text = response.output_text;

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    const parsed = JSON.parse(text.slice(start, end));

    return Response.json(parsed);

  } catch (err) {
    console.error("API Error:", err);

    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
