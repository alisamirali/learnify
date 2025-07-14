import { CourseProgressCard } from "@/app/dashboard/_components/course-progress-card";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { EmptyState } from "@/components/shared/empty-state";
import { PublicCourseCard } from "../(public)/_components/public-course-card";

export default async function DashboardPage() {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          You are enrolled in {enrolledCourses.length} course
          {enrolledCourses.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.Course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Enrolled Courses"
          description="You are not enrolled in any courses."
          buttonText="Browse Courses"
          buttonLink="/courses"
        />
      )}

      <section className="mt-8">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-2xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            We have {allCourses.length} course
            {allCourses.length !== 1 ? "s" : ""} available for you to explore.
          </p>
        </div>

        {allCourses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} course={course} />
              ))}
          </div>
        ) : (
          <EmptyState
            title="No Available Courses"
            description="You are already enrolled in all available courses. Come back later!"
          />
        )}
      </section>
    </>
  );
}
