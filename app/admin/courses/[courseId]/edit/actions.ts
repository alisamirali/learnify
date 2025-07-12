"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { S3 } from "@/lib/s3-client";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zod-schema";
import { request } from "@arcjet/next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message: "Request denied by Arcjet",
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid course data.",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course.",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    // Update all chapter positions in a transaction
    await prisma.$transaction(
      chapters.map((chapter) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: chapter.position },
        })
      )
    );

    // Revalidate the course edit page to reflect changes
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    // First, get the courseId from the chapter and validate lessons belong to this chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        courseId: true,
        lessons: {
          select: { id: true },
        },
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    // Validate that all lessons belong to this chapter
    const chapterLessonIds = new Set(chapter.lessons.map((l) => l.id));
    const invalidLessons = lessons.filter((l) => !chapterLessonIds.has(l.id));

    if (invalidLessons.length > 0) {
      return {
        status: "error",
        message: "Some lessons do not belong to this chapter",
      };
    }

    // Update all lesson positions in a transaction
    await prisma.$transaction(
      lessons.map((lesson) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
            chapterId: chapterId, // Additional safety check
          },
          data: { position: lesson.position },
        })
      )
    );

    // Revalidate the course edit page to reflect changes
    revalidatePath(`/admin/courses/${chapter.courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid chapter data.",
      };
    }

    let createdChapter;

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      createdChapter = await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
      data: createdChapter,
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid lesson data.",
      };
    }

    let createdLesson;

    await prisma.$transaction(async (tx) => {
      // Verify the chapter exists and belongs to the correct course
      const chapter = await tx.chapter.findFirst({
        where: {
          id: result.data.chapterId,
          courseId: result.data.courseId,
        },
      });

      if (!chapter) {
        throw new Error(
          "Chapter not found or doesn't belong to the specified course"
        );
      }

      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      createdLesson = await tx.lesson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          description: result.data.description,
          thumbnailKey: result.data.thumbnailKey,
          videoKey: result.data.videoKey,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
      data: createdLesson,
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

export async function deleteLesson(lessonId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        chapterId: true,
        position: true,
        thumbnailKey: true,
        videoKey: true,
        Chapter: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lesson) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Delete the lesson first
      await tx.lesson.delete({
        where: { id: lessonId },
      });

      // Update positions of remaining lessons in the same chapter
      // Move all lessons with position > deleted lesson's position down by 1
      await tx.lesson.updateMany({
        where: {
          chapterId: lesson.chapterId,
          position: {
            gt: lesson.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    });

    // Clean up S3 files if they exist
    const filesToDelete = [];
    if (lesson.thumbnailKey) filesToDelete.push(lesson.thumbnailKey);
    if (lesson.videoKey) filesToDelete.push(lesson.videoKey);

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
        throw new Error("Failed to clean up S3 files for lesson");
      }
    }

    revalidatePath(`/admin/courses/${lesson.Chapter.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function deleteChapter(chapterId: string): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        courseId: true,
        position: true,
        lessons: {
          select: {
            id: true,
            thumbnailKey: true,
            videoKey: true,
          },
        },
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Delete all lessons in the chapter first
      await tx.lesson.deleteMany({
        where: { chapterId: chapterId },
      });

      // Delete the chapter
      await tx.chapter.delete({
        where: { id: chapterId },
      });

      // Update positions of remaining chapters in the same course
      // Move all chapters with position > deleted chapter's position down by 1
      await tx.chapter.updateMany({
        where: {
          courseId: chapter.courseId,
          position: {
            gt: chapter.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    });

    // Clean up S3 files from all lessons in the chapter
    const filesToDelete: string[] = [];
    chapter.lessons.forEach((lesson) => {
      if (lesson.thumbnailKey) filesToDelete.push(lesson.thumbnailKey);
      if (lesson.videoKey) filesToDelete.push(lesson.videoKey);
    });

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
        throw new Error("Failed to clean up S3 files for chapter lessons");
      }
    }

    revalidatePath(`/admin/courses/${chapter.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter and all its lessons deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
