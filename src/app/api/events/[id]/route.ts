import db from "@/db/database";
import { eventsTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { restrictAdmin } from "@/lib/jwt";

interface GetParams {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: GetParams }) {
  const { id } = await params;

  try {
    const events = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (events.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Event not found",
        data: null,
      };

      return NextResponse.json(response, {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: events[0],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to fetch events",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: GetParams }) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const events = await db
      .update(eventsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(eventsTable.id, id))
      .returning();

    if (events.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Event not found",
        data: null,
      };

      return NextResponse.json(response, {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: events[0],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected end of JSON input")
    ) {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Missing fields",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.error("Error fetching events:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to update event",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: GetParams },
) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  const { id } = await params;

  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, id));

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: null,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to fetch events",
      data: null,
    };

    return NextResponse.json(response, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
