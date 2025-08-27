const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      return Response.json(
        { error: "Only JPEG files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size (400KB max)
    if (file.size > 400 * 1024) {
      return Response.json(
        { error: "File size must be less than 400KB" },
        { status: 400 },
      );
    }

    // Generate filename with current date
    const today = new Date().toISOString().split("T")[0];
    const timestamp = Date.now();
    const filename = `${today}-${timestamp}.jpg`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to storage
    const response = await fetch(
      `${API_URL}/storage/v1/object/event-images/${filename}`,
      {
        method: "POST",
        headers: {
          apikey: API_KEY || "",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": file.type,
        },
        body: buffer,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    // Get public URL
    const publicUrl = `${API_URL}/storage/v1/object/public/event-images/${filename}`;

    return Response.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
