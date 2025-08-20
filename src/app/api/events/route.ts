import db from "@/db/database";
import { eventsTable } from "@/db/schema";
import { restrictAdmin } from "@/lib/jwt";
import { StandardResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await db.select().from(eventsTable);

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: events,
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

export async function POST(req: NextRequest) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  try {
    const { user_id, event_title, event_desc, event_date, image_url } =
      await req.json();

    if (!user_id || !event_title || !event_desc || !event_date) {
      const response: StandardResponse = {
        success: false,
        message:
          "User ID, event title, event description, or event date is missing",
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

    await db.insert(eventsTable).values({
      imageUrl: image_url ?? null,
      eventTitle: event_title,
      eventDate: new Date(event_date),
      eventDesc: event_desc,
      createdBy: user_id,
    });

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: null,
    };

    return NextResponse.json(response, {
      status: 201,
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
        message:
          "User ID, event title, event description, or event date is missing",
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
      error: "Failed to create event",
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
