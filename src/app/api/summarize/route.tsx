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
1. Generate a concise, descriptive title for this summary (max 6 words).
2. Generate the full markdown report.
3. Use clean markdown styling: proper headings (# and ##), bullet points, and short paragraphs.
4. DO NOT use brutal or ugly dividers like "=====" or "-----". Use soft thematic breaks (***) if necessary, but sparingly.
5. Stick to the content, but generate thoughtful insights or summaries if possible.
6. DO NOT use emojis or waste tokens.
7. Return your response as a JSON object matching this exact schema:
{
  "title": "string",
  "report": "string (the full markdown content)"
}

Start the JSON response now:`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 8192,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = result.choices[0]?.message?.content;
    const parsed = JSON.parse(raw || "{}");

    return NextResponse.json(
      {
        title: parsed.title || input.slice(0, 50),
        report: parsed.report || ""
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error generating report:", err);
    return NextResponse.json(
      { error: "Failed to generate report." },
      { status: 500 }
    );
  }
}
