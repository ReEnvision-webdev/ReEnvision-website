import db from "@/db/database";
import { coursesTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // We expect the image to be uploaded separately first, and the URL passed in the body.
        const { course_name, course_description, course_price, courses_image } = await req.json();

        if (!course_name || !course_description || !course_price || !courses_image) {
            return NextResponse.json({ error: "Missing required fields. All fields are required, including the image URL." }, { status: 400 });
        }

        const newCourse = await db
            .insert(coursesTable)
            .values({
                course_name,
                course_description,
                course_price,
                courses_image, // This is the public URL from the storage
            })
            .returning();

        return NextResponse.json({ message: "Course created successfully", course: newCourse[0] }, { status: 201 });
    } catch (error) {
        console.error("Error creating course:", error);
        // Check for a specific known error, e.g., unique constraint violation, if applicable
        // if (error.code === '23505') { ... }
        return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
