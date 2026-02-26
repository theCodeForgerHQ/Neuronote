import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { currentUser } from "@clerk/nextjs/server";
import { CohereClient } from "cohere-ai";
import { db } from "@/db";
import { notes } from "@/db/schema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const input = text.slice(0, 8000);
    const today = new Date().toISOString().split("T")[0];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a language model designed to extract logically atomic notes from a text. Each note must represent one distinct, meaningful thought or unit of information.

Today's date is ${today}. Use this to resolve relative time references like "tomorrow", "next week", etc.

Follow these strict rules:
- Each note must be an individual, self-contained concept (e.g. quotes, statements, tasks).
- Trim whitespaces from all notes.
- Capitalize the first word of each note if it starts a sentence or if grammar requires it.
- If the input is gibberish or contains no valid content, return {"notes": []}.
- NEVER fabricate information. Only extract what exists in the input.
- NEVER change the user's tone or voice. Apply only minimal grammar corrections (e.g. capitalization).
- DO NOT GUESS dates or times. Only assign a timeRef if the text clearly includes a specific, unambiguous time reference.
- If no valid time is present in the note, timeRef MUST be null.
- Treat structured content like code snippets, derivations, or formulas as a single note, preserving internal newlines only when they convey meaning.
- Do not split such structured blocks into multiple notes.

Each note object must match this schema:
{
  note: string (required, trimmed, never empty),
  type: one of ["note", "idea", "task", "goal", "fact", "definition", "decision", "insight", "event", "reminder", "question", "quote", "bookmark", "contact"],
  people: string[] (can be empty),
  place: string[] (can be empty),
  priority: "low" | "medium" | "high" | null,
  timeRef: string | null (ISO 8601 timestamp if any time-related content exists),
  dueDate: string | null (ISO 8601 timestamp for explicit deadlines, separate from timeRef),
  tags: string[] (for keyword search, can be empty),
  category: "personal" | "work" | "health" | "finance" | "learning" | "general",
  urgency: "none" | "low" | "high",
  sentiment: "positive" | "negative" | "neutral" | "mixed",
  status: "active" | "archived" | "completed" | "deferred"
}

Return a JSON object with a "notes" key containing an array of such note objects.
DO NOT include anything other than valid structured objects.

Example input:
"Meet Alice at the station by 5PM. She thinks the project is a good idea."

Example output:
{
  "notes": [
    {
      "note": "Meet Alice at the station by 5PM",
      "type": "task",
      "people": ["Alice"],
      "place": ["station"],
      "priority": "medium",
      "timeRef": "${today}T17:00:00.000Z",
      "dueDate": "${today}T17:00:00.000Z",
      "tags": ["meeting"],
      "category": "work",
      "urgency": "low",
      "sentiment": "neutral",
      "status": "active"
    },
    {
      "note": "She thinks the project is a good idea",
      "type": "insight",
      "people": ["Alice"],
      "place": [],
      "priority": null,
      "timeRef": null,
      "dueDate": null,
      "tags": ["project", "opinion"],
      "category": "work",
      "urgency": "none",
      "sentiment": "positive",
      "status": "active"
    }
  ]
}`,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    const parsed = JSON.parse(raw || "{}");
    const data = parsed.notes as {
      note: string;
      type: string;
      people: string[] | [];
      place: string[] | [];
      priority: string | null;
      timeRef: string | null;
      dueDate: string | null;
      tags: string[] | [];
      category: string | null;
      urgency: string | null;
      sentiment: string | null;
      status: string | null;
    }[];

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        success: false,
        data: [],
      });
    }

    // --- Chunk deduplication: remove notes with near-identical text ---
    const seen = new Set<string>();
    const deduped = data.filter((item) => {
      const key = item.note.trim().toLowerCase().replace(/\s+/g, " ");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // --- Tag normalization: lowercase, trim, deduplicate per note ---
    for (const item of deduped) {
      if (item.tags?.length) {
        const uniqueTags = [
          ...new Set(item.tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
        ];
        item.tags = uniqueTags;
      }
    }

    const embedRes = await cohere.embed({
      texts: deduped.map((item) => item.note),
      model: "embed-english-v3.0",
      inputType: "search_document",
    });

    const embeddings = embedRes.embeddings as number[][];

    const rows = deduped.map((item, idx) => ({
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
      dueDate:
        item.dueDate && !isNaN(new Date(item.dueDate).getTime())
          ? new Date(item.dueDate)
          : null,
      tags: item.tags ?? [],
      isDone: item.type === "task" ? false : null,
      category: item.category ?? "general",
      urgency: item.urgency ?? "none",
      sentiment: item.sentiment ?? "neutral",
      status: item.status ?? "active",
      source: "manual",
      relatedNoteIds: [],
      embedding: embeddings[idx],
    }));

    const inserted = await db.insert(notes).values(rows).returning();

    return NextResponse.json({
      success: true,
      data: inserted,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
