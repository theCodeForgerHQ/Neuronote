import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { note, createdAt } = await req.json();

    if (
      !note ||
      typeof note !== "string" ||
      !createdAt ||
      isNaN(new Date(createdAt).getTime())
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const createdDate = new Date(createdAt);

    await db
      .delete(notes)
      .where(
        and(
          eq(notes.userId, user.id),
          eq(notes.note, note.trim()),
          eq(notes.createdAt, createdDate)
        )
      );

    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
