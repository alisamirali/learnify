import { courseCategories, courseLevels, courseStatus } from "@/lib/data";
import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(100, {
      message: "Title must not exceed 100 characters",
    }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  fileKey: z.string().min(1, {
    message: "File key must not be empty",
  }),
  price: z.coerce.number().min(1, {
    message: "Price must be positive number",
  }),
  duration: z.coerce
    .number()
    .min(1, {
      message: "Duration must be at least 1 hour",
    })
    .max(500, {
      message: "Duration must not exceed 500 hours",
    }),
  level: z.enum(courseLevels, {
    message: "Level must be one of BEGINNER, INTERMEDIATE, or ADVANCED",
  }),
  category: z.enum(courseCategories, {
    message: "Category must be one of the predefined course categories",
  }),
  smallDescription: z
    .string()
    .min(3, {
      message: "Small description must be at least 3 characters long",
    })
    .max(200, {
      message: "Small description must not exceed 200 characters",
    }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters long",
  }),
  status: z.enum(courseStatus, {
    message: "Status must be one of DRAFT, PUBLISHED, or ARCHIVED",
  }),
});

export const chapterSchema = z.object({
  name: z.string().min(3, {
    message: "Chapter name must be at least 3 characters long",
  }),
  courseId: z.string().uuid({
    message: "Course ID must be a valid UUID",
  }),
});

export const lessonSchema = z.object({
  name: z.string().min(3, {
    message: "Lesson name must be at least 3 characters long",
  }),
  courseId: z.string().uuid({
    message: "Course ID must be a valid UUID",
  }),
  chapterId: z.string().uuid({
    message: "Chapter ID must be a valid UUID",
  }),
  description: z
    .string()
    .min(5, {
      message: "Description must be at least 5 characters long",
    })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
