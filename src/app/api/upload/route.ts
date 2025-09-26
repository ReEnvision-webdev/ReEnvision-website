const API_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uploadType = (formData.get("uploadType") as string) || "event"; // Default to 'event' for backward compatibility

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

    // Determine the storage bucket based on the upload type
    const storagePath = uploadType === "course" ? "courses" : "event-images";

    // Generate filename
    const today = new Date().toISOString().split("T")[0];
    const timestamp = Date.now();
    const filename = `${today}-${timestamp}.jpg`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to the determined storage bucket using the SERVICE_KEY
    const response = await fetch(
      `${API_URL}/storage/v1/object/${storagePath}/${filename}`,
      {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY || "",
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": file.type,
        },
        body: buffer,
      },
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Supabase Upload Error:", errorBody);
      throw new Error(
        errorBody.message || "Failed to upload image to storage.",
      );
    }

    // Get public URL from the correct path
    const publicUrl = `${API_URL}/storage/v1/object/public/${storagePath}/${filename}`;

    return Response.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return Response.json(
      { error: `Failed to upload image: ${message}` },
      { status: 500 },
    );
  }
}
