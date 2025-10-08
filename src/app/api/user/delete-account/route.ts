import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth.config";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({
        success: false,
        message: "Unauthorized",
        error: "You must be logged in to delete your account",
      },
      { status: 401 }
    );
  }

  const { email } = await request.json();

  // Validate that the email matches the session's email for confirmation
  if (email !== session.user.email) {
      return NextResponse.json({
        success: false,
        message: "Email confirmation does not match.",
        error: "Invalid email confirmation",
      },
      { status: 400 }
    );
  }


  try {
    // Delete the user from the database
    const deletedUser = await db
      .delete(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .returning();

    if (deletedUser.length === 0) {
        return NextResponse.json({
            success: false,
            message: "User not found or already deleted.",
            error: "User not found"
        }, { status: 404 });
    }

    // Success response
    return NextResponse.json({
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({
        success: false,
        message: "Internal server error while deleting account.",
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
