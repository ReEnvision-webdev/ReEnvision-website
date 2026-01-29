import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db/database';
import { hoursTable } from '@/db/schema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { type Session } from 'next-auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user.isAdmin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, approved, adminComments } = await request.json();

    if (typeof id === 'undefined' || approved === undefined) {
      return Response.json({ error: 'Missing required fields: id and approved status' }, { status: 400 });
    }

    // Update the hour entry with approval status and admin comments
    const [updatedHour] = await db
      .update(hoursTable)
      .set({
        approved,
        adminComments: adminComments || null,
        ratedAt: new Date(),
      })
      .where(eq(hoursTable.id, id))
      .returning();

    if (!updatedHour) {
      return Response.json({ error: 'Hour entry not found' }, { status: 404 });
    }

    return Response.json(updatedHour, { status: 200 });
  } catch (error) {
    console.error('Error updating hour approval:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}