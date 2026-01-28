import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadImage } from "@/db/supabaseStorage";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("profilePicture") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Profile picture is required" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "File size too large. Maximum size is 5MB.",
        },
        { status: 400 },
      );
    }

    // Upload to Supabase storage
    const imageUrl = await uploadImage(file, "profile");

    // Update user profile picture in database
    const updatedUsers = await db
      .update(usersTable)
      .set({ profilePicture: imageUrl })
      .where(eq(usersTable.id, session.user.id))
      .returning({ profilePicture: usersTable.profilePicture });

    const newProfilePicture = updatedUsers[0]?.profilePicture;

    if (!newProfilePicture) {
      return NextResponse.json(
        { success: false, message: "Could not update profile picture" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: newProfilePicture,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the profile picture",
      },
      { status: 500 },
    );
  }
}
