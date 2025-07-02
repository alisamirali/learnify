import { S3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Missing key in request body" },
        { status: 400 }
      );
    }

    console.log("Deleting file with key:", key);
    console.log("Bucket name:", process.env.NEXT_PUBLIC_S3_BUCKET_NAME);

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
