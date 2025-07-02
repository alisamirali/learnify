"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schema";
import { headers } from "next/headers";

export async function CreateCourse(values: CourseSchema): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const validatedData = courseSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid course data",
      };
    }

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
