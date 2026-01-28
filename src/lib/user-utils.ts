import db from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get user profile picture by user ID
 * @param userId - The ID of the user
 * @returns The profile picture URL or null if user not found
 */
export async function getUserProfilePicture(
  userId: string,
): Promise<string | null> {
  try {
    const [user] = await db
      .select({
        profilePicture: usersTable.profilePicture,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return user?.profilePicture || null;
  } catch (error) {
    console.error("Error fetching user profile picture:", error);
    return null;
  }
}

/**
 * Get user by ID with profile picture
 * @param userId - The ID of the user
 * @returns User object with profile picture or null if user not found
 */
export async function getUserWithProfilePicture(userId: string) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        profilePicture: usersTable.profilePicture,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return user || null;
  } catch (error) {
    console.error("Error fetching user with profile picture:", error);
    return null;
  }
}
