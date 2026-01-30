import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/database';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  if (req.method === 'GET') {
    try {
      const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

      if (user.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return only the fields needed by the modal
      const userData = {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        profilePicture: user[0].profilePicture,
        isVerified: user[0].isVerified,
        isAdmin: user[0].isAdmin,
        requiredHours: parseFloat(user[0].hours) || 0,
        isBanned: user[0].isBanned,
      };

      return res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { requiredHours, isVerified, isAdmin, isBanned } = req.body;

      // Build update object based on provided fields
      const updateData: Partial<typeof usersTable.$inferInsert> = {};

      if (typeof requiredHours !== 'undefined') {
        updateData.hours = requiredHours.toString(); // Convert to string as expected by numeric type
      }

      if (typeof isVerified !== 'undefined') {
        updateData.isVerified = Boolean(isVerified);
      }

      if (typeof isAdmin !== 'undefined') {
        updateData.isAdmin = Boolean(isAdmin);
      }

      if (typeof isBanned !== 'undefined') {
        updateData.isBanned = Boolean(isBanned);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      // If user is being banned, delete their hours entries
      if (updateData.isBanned === true) {
        const { hoursTable } = await import('@/db/schema');

        // Delete all hours entries for this user
        await db.delete(hoursTable).where(eq(hoursTable.userId, id));
      }

      // Perform the update
      const updatedUsers = await db.update(usersTable)
        .set(updateData)
        .where(eq(usersTable.id, id))
        .returning();

      if (updatedUsers.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the updated user data
      const updatedUser = {
        id: updatedUsers[0].id,
        email: updatedUsers[0].email,
        name: updatedUsers[0].name,
        profilePicture: updatedUsers[0].profilePicture,
        isVerified: updatedUsers[0].isVerified,
        isAdmin: updatedUsers[0].isAdmin,
        requiredHours: parseFloat(updatedUsers[0].hours) || 0,
        isBanned: updatedUsers[0].isBanned,
      };

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}