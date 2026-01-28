import db from "@/db/database";
import { chaptersTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { restrictAdmin } from "@/lib/jwt";

interface ChapterPutBody {
  name?: string;
  location?: string;
  description?: string;
  website?: string;
  updatedAt: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const chapters = await db
      .select()
      .from(chaptersTable)
      .where(eq(chaptersTable.id, id))
      .limit(1);

    if (chapters.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Chapter not found",
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
      data: chapters[0],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to fetch chapter",
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // Validate required fields if they are provided
    if (body.name !== undefined && body.name === "") {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Chapter name cannot be empty",
        data: null,
      };

      return NextResponse.json(response, {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Map API field names to database field names
    const updateData: ChapterPutBody = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.website !== undefined) updateData.website = body.website;

    const chapters = await db
      .update(chaptersTable)
      .set(updateData)
      .where(eq(chaptersTable.id, id))
      .returning();

    if (chapters.length === 0) {
      const response: StandardResponse = {
        success: false,
        message: null,
        error: "Chapter not found",
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
      data: chapters[0],
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

    console.error("Error updating chapter:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to update chapter",
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
  { params }: { params: Promise<{ id: string }> },
) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  const { id } = await params;

  try {
    await db.delete(chaptersTable).where(eq(chaptersTable.id, id));

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
    console.error("Error deleting chapter:", error);

    const response: StandardResponse = {
      success: false,
      message: "Internal server error",
      error: "Failed to delete chapter",
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