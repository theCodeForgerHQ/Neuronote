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
    const { id } = await req.json();

    if (typeof id !== "number" || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)));

    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
