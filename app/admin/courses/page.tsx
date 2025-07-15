import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./_components/admin-course-card";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  if (!data || data.length === 0)
    return (
      <EmptyState
        title="No Courses Found"
        description="Looks like you haven't created any courses yet."
        buttonText="Create Course"
        buttonLink="/admin/courses/create"
      />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
