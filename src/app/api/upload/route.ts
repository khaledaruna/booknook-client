import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image must be between 1 byte and 5 MB" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "IMGBB_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const imgbbBody = new URLSearchParams();
    imgbbBody.append("image", base64Image);

    const cleanName = file.name.replace(/\.[^/.]+$/, "").trim();
    if (cleanName) {
      imgbbBody.append("name", cleanName);
    }

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: imgbbBody,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result?.error?.message || "ImgBB upload failed",
        },
        { status: response.ok ? 500 : response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
    });
  } catch (error) {
    console.error("ImgBB upload route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal upload error" },
      { status: 500 }
    );
  }
}