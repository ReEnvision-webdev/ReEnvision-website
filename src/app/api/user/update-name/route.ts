import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { type Session } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 },
      );
    }

    const updatedUsers = await db
      .update(usersTable)
      .set({ name })
      .where(eq(usersTable.id, session.user.id))
      .returning({ name: usersTable.name });

    const newName = updatedUsers[0]?.name;

    if (!newName) {
      return NextResponse.json(
        { success: false, message: "Could not update name" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Name updated successfully",
      name: newName,
    });
  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the name" },
      { status: 500 },
    );
  }
}
