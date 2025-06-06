import { NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: text must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const embedRes = await cohere.embed({
      texts: [text],
      model: "embed-english-v3.0",
      inputType: "search_query",
    });

    const embeddings = embedRes.embeddings as number[][];

    if (!embeddings || !Array.isArray(embeddings[0])) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve embedding." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      embedding: embeddings[0],
    });
  } catch (error) {
    console.error("Embedding error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
