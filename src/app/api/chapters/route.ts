import db from "@/db/database";
import { chaptersTable } from "@/db/schema";
import { restrictAdmin } from "@/lib/jwt";
import { StandardResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const chapters = await db.select().from(chaptersTable);

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: chapters,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to fetch chapters",
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
    const { name, location, description, website } = await req.json();

    if (!name || !location || !description) {
      const response: StandardResponse = {
        success: false,
        message: "Name, location, or description is null or undefined",
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

    const newChapters = await db
      .insert(chaptersTable)
      .values({
        name: name,
        location: location,
        description: description,
        website: website ?? null,
      })
      .returning();

    const response: StandardResponse = {
      success: true,
      message: null,
      error: null,
      data: newChapters[0],
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating chapter:", error);

    if (
      error instanceof SyntaxError &&
      error.message.includes("Unexpected end of JSON input")
    ) {
      const response: StandardResponse = {
        success: false,
        message: "Name, location, or description is null or undefined",
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

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to create chapter",
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