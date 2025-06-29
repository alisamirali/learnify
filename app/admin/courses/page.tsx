import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <div>
        <h2>
          Here you can manage your courses. You can create, edit, and delete
          courses as needed.
        </h2>
      </div>
    </>
  );
}
