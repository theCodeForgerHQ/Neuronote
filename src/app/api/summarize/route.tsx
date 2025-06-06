import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { input, notes } = await req.json();

    if (!input || !Array.isArray(notes) || notes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid input or empty notes." }),
        {
          status: 400,
        }
      );
    }

    const contextBlob = notes
      .map((note, i) => {
        return `Note ${i + 1}:
- Content: ${note.note}
- Type: ${note.type}
- People: ${note.people.join(", ") || "None"}
- Place: ${note.place.join(", ") || "None"}
- Priority: ${note.priority || "None"}
- TimeRef: ${note.timeRef || "None"}
- Tags: ${note.tags.join(", ") || "None"}
- Done: ${
          note.isDone === true
            ? "Yes"
            : note.isDone === false
            ? "No"
            : "Unspecified"
        }`;
      })
      .join("\n\n");

    const prompt = `You are an AI assistant. Based on the following personal knowledge base, generate a detailed, well-structured, and markdown-formatted report in response to the user's request.

---

## Notes Context:
${contextBlob}

---

## User Request:
"""
${input}
"""

---

## Instructions:
- Your output should be a complete markdown document.
- Include clear headings, subheadings, bullet points, and spacing.
- Maintain a structured, informative, and coherent tone.
- Stick to the content, but generate thoughtful insights or summaries if possible.
- DO NOT use emojis or waste tokens.
- You are allowed to use the full context and input to generate a comprehensive response.

Start the markdown response now:`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 8192,
        temperature: 0.5,
      },
    });

    const text = result.text;
    console.log(text);

    return new Response(JSON.stringify({ report: text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate report." }),
      {
        status: 500,
      }
    );
  }
}
