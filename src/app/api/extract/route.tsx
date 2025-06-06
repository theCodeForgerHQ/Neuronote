import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import { CohereClient } from "cohere-ai";
import { db } from "@/db";
import { notes } from "@/db/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: Request) {
  const user = await currentUser();

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a language model designed to extract logically atomic notes from a text. Each note must represent one distinct, meaningful thought or unit of information. Follow these strict rules:

- Each note must be an individual, self-contained concept (e.g. quotes, statements, tasks).
- Trim whitespaces from all notes.
- If the input is gibberish or contains no valid content, return an empty array.
- NEVER fabricate information. Only extract what exists in the input.
- NEVER change the user's tone or voice. Apply only minor grammatical or completion adjustments where needed.
- DO NOT GUESS dates or times. Only assign a timeRef if the text clearly includes a specific, unambiguous time reference (e.g. "5 PM", "tomorrow at noon", "June 10").
- If no valid time is present in the note, timeRef MUST be null.
- Each note object must strictly match this schema:

{
  note: string (required, trimmed, never empty),
  type: one of ["note", "idea", "task", "goal", "fact", "definition", "decision", "insight", "event", "reminder", "question", "quote"],
  people: string[] (can be empty),
  place: string[] (can be empty),
  priority: string | null,
  timeRef: string | null (ISO 8601 timestamp if any time-related content exists),
  tags: string[] (for keyword search, can be empty)
}

Return a JSON array of such notes. DO NOT include anything other than valid structured objects. Example input: "Meet Alice at the station by 5PM. She thinks the project is a good idea."

Example output:
[
  {
    note: "Meet Alice at the station by 5PM",
    type: "task",
    people: ["Alice"],
    place: ["station"],
    priority: null,
    timeRef: "2025-06-05T17:00:00.000Z",
    tags: ["meeting"]
  },
  {
    note: "She thinks the project is a good idea",
    type: "insight",
    people: ["Alice"],
    place: [],
    priority: null,
    timeRef: null,
    tags: ["project", "opinion"]
  }
]

INPUT:
${text}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              note: { type: Type.STRING },
              type: { type: Type.STRING },
              people: { type: Type.ARRAY, items: { type: Type.STRING } },
              place: { type: Type.ARRAY, items: { type: Type.STRING } },
              priority: { type: Type.STRING },
              timeRef: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["note", "type", "people", "place", "tags"],
          },
        },
      },
    });

    const raw = response.text;
    const data = JSON.parse(raw || "") as {
      note: string;
      type: string;
      people: string[] | [];
      place: string[] | [];
      priority: string | null;
      timeRef: string | null;
      tags: string[] | [];
    }[];

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        success: false,
        data: [],
      });
    }

    const embedRes = await cohere.embed({
      texts: data.map((item) => item.note),
      model: "embed-english-v3.0",
      inputType: "search_document",
    });

    const embeddings = embedRes.embeddings as number[][];

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = data.map((item, idx) => ({
      userId: user.id,
      createdAt: new Date(),
      note: item.note.trim(),
      type: item.type,
      people: item.people ?? [],
      place: item.place ?? [],
      priority: item.priority ?? null,
      timeRef:
        item.timeRef && !isNaN(new Date(item.timeRef).getTime())
          ? new Date(item.timeRef)
          : null,
      tags: item.tags ?? [],
      isDone: item.type === "task" ? false : null,
      embedding: embeddings[idx],
    }));
    await db.insert(notes).values(rows);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
