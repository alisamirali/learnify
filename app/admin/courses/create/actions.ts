"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function createCourse(
  values: CourseSchemaType
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

    const validatedData = courseSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid course data",
      };
    }

    const data = await stripe.products.create({
      name: validatedData.data.title,
      description: validatedData.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validatedData.data.price * 100, // Convert to cents
      },
    });

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
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
