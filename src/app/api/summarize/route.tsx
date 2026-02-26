import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { input, notes } = await req.json();

    if (!input || !Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json(
        { error: "Invalid input or empty notes." },
        { status: 400 }
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
- Category: ${note.category || "None"}
- Urgency: ${note.urgency || "None"}
- DueDate: ${note.dueDate || "None"}
- Status: ${note.status || "None"}
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

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 8192,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = result.choices[0]?.message?.content;

    return NextResponse.json({ report: text }, { status: 200 });
  } catch (err) {
    console.error("Error generating report:", err);
    return NextResponse.json(
      { error: "Failed to generate report." },
      { status: 500 }
    );
  }
}
