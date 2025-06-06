import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface RequestBody {
  id: number;
  state: boolean;
}

export async function PATCH(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id, state }: RequestBody = await req.json();

    if (typeof id !== "number" || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing 'id' in request body" },
        { status: 400 }
      );
    }

    if (typeof state !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing 'state' in request body",
        },
        { status: 400 }
      );
    }

    console.log(state);

    const updateResult = await db
      .update(notes)
      .set({ isDone: state })
      .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Note not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Note updated" });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
