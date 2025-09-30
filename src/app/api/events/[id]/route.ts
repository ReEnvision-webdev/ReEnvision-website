import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/database";
import { eventsTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { restrictAdmin } from "@/lib/jwt";

// GET a single event by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));

    if (!event) {
      const response: StandardResponse = {
        success: false,
        error: "Event not found",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: event,
      message: "Event fetched successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// UPDATE an event by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminResponse = await restrictAdmin(req);
  if (adminResponse) {
    return adminResponse;
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { event_title, event_desc, event_date, image_url } = body;

    // Use a partial type inferred from the database schema to avoid `any`
    const updateFields: Partial<typeof eventsTable.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (event_title !== undefined) updateFields.eventTitle = event_title;
    if (event_desc !== undefined) updateFields.eventDesc = event_desc;
    if (event_date !== undefined) updateFields.eventDate = new Date(event_date);
    // Check if `image_url` was explicitly included in the request body
    if ("image_url" in body) {
      updateFields.imageUrl = image_url;
    }

    // Ensure there's something to update besides the timestamp
    if (Object.keys(updateFields).length === 1) {
      const response: StandardResponse = {
        success: false,
        error: "No update fields provided",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const [updatedEvent] = await db
      .update(eventsTable)
      .set(updateFields)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!updatedEvent) {
      const response: StandardResponse = {
        success: false,
        error: "Event not found or failed to update",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE an event by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminResponse = await restrictAdmin(req);
  if (adminResponse) {
    return adminResponse;
  }

  try {
    const { id } = await params;
    const [deletedEvent] = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!deletedEvent) {
      const response: StandardResponse = {
        success: false,
        error: "Event not found",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: null,
      message: "Event deleted successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
