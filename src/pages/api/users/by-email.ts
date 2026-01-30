import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/database';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing email' });
  }

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

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
  } catch (error: any) {
    console.error('Error fetching user by email:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}