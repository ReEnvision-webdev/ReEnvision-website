import db from "@/db/database";
import { coursesTable } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

// PUT (update) a course
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const { course_name, course_description, course_price, courses_image } = await req.json();

        if (!course_name || !course_description || !course_price || !courses_image) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedCourse = await db
            .update(coursesTable)
            .set({ course_name, course_description, course_price, courses_image })
            .where(eq(coursesTable.id, id))
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
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const deletedCourse = await db
            .delete(coursesTable)
            .where(eq(coursesTable.id, id))
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
