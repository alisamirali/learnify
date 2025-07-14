import "server-only";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      // total signups
      prisma.user.count(),

      // total customers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),

      // total courses
      prisma.course.count(),

      // total lessons
      prisma.lesson.count(),
    ]);

  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
