import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { summaries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(summaries)
      .where(eq(summaries.userId, user.id))
      .orderBy(desc(summaries.createdAt));

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query, report } = await req.json();
    if (!query || !report) {
      return NextResponse.json({ error: "Missing query or report" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(summaries)
      .values({
        userId: user.id,
        query: query.trim(),
        report: report.trim(),
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db
      .delete(summaries)
      .where(eq(summaries.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
