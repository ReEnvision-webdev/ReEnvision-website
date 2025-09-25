import { db } from "@/db/index";
import { coursesTable } from "@/db/schema";
import { NextResponse } from "next/server";

const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = formData.get("uploadType") as string | null;

    // ========== NEW: COURSE UPLOAD LOGIC ==========
    if (uploadType === 'course') {
      const course_name = formData.get("course_name") as string;
      const course_description = formData.get("course_description") as string;
      // Use parseFloat to handle numeric conversion correctly
      const course_price_str = formData.get("course_price") as string;
      const course_price = parseFloat(course_price_str);

      if (!file || !course_name || !course_description || isNaN(course_price)) {
        return NextResponse.json({ error: "Missing required fields: file, course_name, course_description, and a valid course_price are all required." }, { status: 400 });
      }

      // Corrected bucket name to 'courses'
      const bucketName = 'courses';

      if (!file.type.includes("jpeg") && !file.type.includes("jpg") && !file.type.includes("png")) {
        return NextResponse.json({ error: "Only JPG or PNG files are allowed for course images" }, { status: 400 });
      }
      if (file.size > 400 * 1024) {
        return NextResponse.json({ error: "File size must be less than 400KB" }, { status: 400 });
      }

      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const buffer = await file.arrayBuffer();

      const uploadResponse = await fetch(`${API_URL}/storage/v1/object/${bucketName}/${filename}`, {
        method: "POST",
        headers: {
          apikey: API_KEY || "",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": file.type,
        },
        body: buffer,
      });

      if (!uploadResponse.ok) {
        const errorBody = await uploadResponse.json();
        console.error("Supabase Storage Error:", errorBody);
        throw new Error(`Failed to upload course image. Status: ${uploadResponse.status}`);
      }
      
      const publicUrl = `${API_URL}/storage/v1/object/public/${bucketName}/${filename}`;

      const newCourse = await db
        .insert(coursesTable)
        .values({
          course_name,
          course_description,
          course_price: course_price.toString(), // Convert back to string for numeric DB type
          courses_image: publicUrl,
        })
        .returning();

      return NextResponse.json({ message: "Course created successfully", course: newCourse[0] }, { status: 201 });

    } else {
      // ========== ORIGINAL: EVENT IMAGE UPLOAD LOGIC ==========

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        return NextResponse.json({ error: "Only JPEG files are allowed" }, { status: 400 });
      }

      if (file.size > 400 * 1024) {
        return NextResponse.json({ error: "File size must be less than 400KB" }, { status: 400 });
      }

      const today = new Date().toISOString().split("T")[0];
      const timestamp = Date.now();
      const filename = `${today}-${timestamp}.jpg`;
      const buffer = await file.arrayBuffer();

      const response = await fetch(`${API_URL}/storage/v1/object/event-images/${filename}`, {
        method: "POST",
        headers: {
          apikey: API_KEY || "",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": file.type,
        },
        body: buffer,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const publicUrl = `${API_URL}/storage/v1/object/public/event-images/${filename}`;
      return NextResponse.json({ url: publicUrl });
    }

  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to process request", details: errorMessage }, { status: 500 });
  }
}
