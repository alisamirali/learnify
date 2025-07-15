"use client";

import { deleteCourse } from "@/app/admin/courses/[courseId]/delete/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteCoursePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();

  function handleRemoveCourse() {
    startTransition(async () => {
      try {
        const result = await deleteCourse(courseId);

        if (result.status === "success") {
          toast.success(result.message);
          router.push("/admin/courses");
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error("An unexpected error occurred while deleting the course.");
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>
            This action cannot be undone. All associated data will be
            permanently removed.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-end gap-4">
          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "secondary",
              className: "cursor-pointer",
            })}
          >
            Cancel
          </Link>

          <Button
            variant="destructive"
            onClick={handleRemoveCourse}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete Course"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
