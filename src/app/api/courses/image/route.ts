import { getImageUrl, uploadImage } from "@/db/supabaseStorage";
import { restrictAdmin } from "@/lib/jwt";
import { StandardResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      const response: StandardResponse = {
        success: false,
        error: "Missing path parameter",
        message: null,
        data: null,
      };

      return NextResponse.json(response, { status: 400 });
    }

    const response: StandardResponse = {
      success: true,
      error: null,
      message: null,
      data: { url: getImageUrl(path, "courses") },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Get image error:", err);

    const response: StandardResponse = {
      success: false,
      error: "Failed to retrieve image",
      message: null,
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const res = await restrictAdmin(req);

  if (res) {
    return res;
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      const response: StandardResponse = {
        success: false,
        error: "No file uploaded",
        message: null,
        data: null,
      };

      return NextResponse.json(response, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      const response: StandardResponse = {
        success: false,
        error: "Unsupported file type",
        message: "Only PNG, JPEG, JPG, and WEBP formats are allowed",
        data: null,
      };

      return NextResponse.json(response, { status: 400 });
    }

    const url = await uploadImage(file, "courses");

    const response: StandardResponse = {
      success: true,
      error: null,
      message: "Image uploaded successfully",
      data: { url },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);

    const response: StandardResponse = {
      success: false,
      error: "Failed to upload image",
      message: null,
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
