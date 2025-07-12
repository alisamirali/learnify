"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { S3 } from "@/lib/s3-client";
import { ApiResponse } from "@/lib/types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // First, fetch the course with all its related data to get file keys
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // Collect all file keys that need to be deleted from S3
    const filesToDelete: string[] = [];

    // Add course thumbnail/cover image
    if (course.fileKey) {
      filesToDelete.push(course.fileKey);
    }

    // Add all lesson files (thumbnails and videos)
    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        if (lesson.thumbnailKey) filesToDelete.push(lesson.thumbnailKey);
        if (lesson.videoKey) filesToDelete.push(lesson.videoKey);
      });
    });

    // Delete all files from S3
    if (filesToDelete.length > 0) {
      try {
        await Promise.all(
          filesToDelete.map(async (key) => {
            const command = new DeleteObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
              Key: key,
            });

            await S3.send(command);
          })
        );
      } catch {
        throw new Error("Failed to delete S3 files");
      }
    }

    // Delete the course from database (this will cascade delete chapters and lessons)
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course and all associated files deleted successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "An unexpected error occurred while deleting the course.",
    };
  }
}
