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
