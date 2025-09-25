import db from "@/db/database";
import { coursesTable } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from 'drizzle-orm';

// GET all courses
export async function GET() {
    try {
        const allCourses = await db.select().from(coursesTable).orderBy(desc(coursesTable.id));
        return NextResponse.json(allCourses, { status: 200 });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST a new course
export async function POST(req: Request) {
    try {
        const { course_name, course_description, course_price, courses_image } = await req.json();

        if (!course_name || !course_description || !course_price || !courses_image) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCourse = await db
            .insert(coursesTable)
            .values({ course_name, course_description, course_price, courses_image })
            .returning();

        return NextResponse.json({ message: "Course created successfully", course: newCourse[0] }, { status: 201 });
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT (update) a course
export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = Number(searchParams.get("id"));

        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        const { course_name, course_description, course_price, courses_image } = await req.json();

        if (!course_name || !course_description || !course_price || !courses_image) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedCourse = await db
            .update(coursesTable)
            .set({ course_name, course_description, course_price, courses_image })
            .where(eq(coursesTable.id, courseId))
            .returning();

        if (updatedCourse.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course updated successfully", course: updatedCourse[0] }, { status: 200 });
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE a course
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = Number(searchParams.get("id"));

        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        const deletedCourse = await db
            .delete(coursesTable)
            .where(eq(coursesTable.id, courseId))
            .returning();

        if (deletedCourse.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
