import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "@/app/admin/courses/_components/admin-course-card";
import { adminGetEnrollmentStats } from "@/app/data/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/shared/empty-state";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            View All
          </Link>
        </div>

        <Suspense fallback={<AdminRecentCourseCardSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        title="No recent courses found."
        description="Try creating a new course."
        buttonText="Create Course"
        buttonLink="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
      {data.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export function AdminRecentCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
