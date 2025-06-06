import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, user.id));

    return NextResponse.json({ success: true, data: userNotes });
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
