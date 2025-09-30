import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/database";
import { coursesTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { restrictAdmin } from "@/lib/jwt";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, id));

    if (!course) {
      const response: StandardResponse = {
        success: false,
        error: "Course not found",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: course,
      message: "Course fetched successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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
    const { course_name, course_description, course_price, courses_image } =
      await req.json();

    const updateObject: Partial<typeof coursesTable.$inferInsert> = {};
    if (course_name) updateObject.course_name = course_name;
    if (course_description)
      updateObject.course_description = course_description;
    if (course_price) updateObject.course_price = course_price;
    if (courses_image) updateObject.courses_image = courses_image;

    if (Object.keys(updateObject).length === 0) {
      const response: StandardResponse = {
        success: false,
        error: "No fields to update",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const [updatedCourse] = await db
      .update(coursesTable)
      .set(updateObject)
      .where(eq(coursesTable.id, id))
      .returning();

    if (!updatedCourse) {
      const response: StandardResponse = {
        success: false,
        error: "Course not found",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: updatedCourse,
      message: "Course updated successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

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
    const [deletedCourse] = await db
      .delete(coursesTable)
      .where(eq(coursesTable.id, id))
      .returning();

    if (!deletedCourse) {
      const response: StandardResponse = {
        success: false,
        error: "Course not found",
        message: null,
        data: null,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: StandardResponse = {
      success: true,
      data: null,
      message: "Course deleted successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
