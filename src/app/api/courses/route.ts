import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import db from "@/db/database";
import { coursesTable } from "@/db/schema";
import { StandardResponse } from "@/lib/types";
import { restrictAdmin } from "@/lib/jwt";

export async function GET() {
  try {
    const allCourses = await db
      .select()
      .from(coursesTable)
      .orderBy(desc(coursesTable.id));

    const response: StandardResponse = {
      success: true,
      data: allCourses,
      message: "Courses fetched successfully",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminResponse = await restrictAdmin(req);
  if (adminResponse) {
    return adminResponse;
  }

  try {
    const { course_name, course_description, course_price, courses_image } =
      await req.json();

    if (
      !course_name ||
      !course_description ||
      !course_price ||
      !courses_image
    ) {
      const response: StandardResponse = {
        success: false,
        data: null,
        message: "Missing required fields",
        error: "Missing required fields",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const [newCourse] = await db
      .insert(coursesTable)
      .values({ course_name, course_description, course_price, courses_image })
      .returning();

    const response: StandardResponse = {
      success: true,
      data: newCourse,
      message: "Course created successfully",
      error: null,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    const response: StandardResponse = {
      success: false,
      data: null,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
