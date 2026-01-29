import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db/database';
import { hoursTable, usersTable } from '@/db/schema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { type Session } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin to determine what data to return
    if (session.user.isAdmin) {
      // Admin can see all hours
      const allHours = await db
        .select({
          id: hoursTable.id,
          userId: hoursTable.userId,
          userEmail: hoursTable.userEmail,
          activityName: hoursTable.activityName,
          date: hoursTable.date,
          hours: hoursTable.hours,
          reflection: hoursTable.reflection,
          approved: hoursTable.approved,
          adminComments: hoursTable.adminComments,
          createdAt: hoursTable.createdAt,
          ratedAt: hoursTable.ratedAt,
          userName: usersTable.name,
        })
        .from(hoursTable)
        .leftJoin(usersTable, eq(hoursTable.userId, usersTable.id))
        .orderBy(hoursTable.createdAt);

      return Response.json(allHours);
    } else {
      // Regular user can only see their own hours
      const userHours = await db
        .select()
        .from(hoursTable)
        .where(eq(hoursTable.userId, session.user.id))
        .orderBy(hoursTable.createdAt);

      return Response.json(userHours);
    }
  } catch (error) {
    console.error('Error fetching hours:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityName, date, hours, reflection } = await request.json();

    // Validate required fields
    if (!activityName || !date || !hours || !reflection) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate reflection is not empty
    if (!reflection.trim()) {
      return Response.json({ error: 'Reflection is required' }, { status: 400 });
    }

    // Convert hours to numeric value
    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours <= 0) {
      return Response.json({ error: 'Hours must be a positive number' }, { status: 400 });
    }

    // Insert the new hour entry
    const [newHour] = await db
      .insert(hoursTable)
      .values({
        userId: session.user.id,
        userEmail: session.user.email,
        activityName,
        date: new Date(date),
        hours: numericHours.toString(), // Store as string since numeric type in PostgreSQL maps to string in JS
        reflection,
        approved: null, // Default to null (pending)
      })
      .returning();

    return Response.json(newHour, { status: 201 });
  } catch (error) {
    console.error('Error submitting hours:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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