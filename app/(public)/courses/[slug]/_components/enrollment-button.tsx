"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourse } from "../actions";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function enroll() {
    startTransition(async () => {
      try {
        const result = await enrollInCourse(courseId);

        if (result.status === "success") {
          toast.success(result.message);
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error(
          "An unexpected error occurred while enrolling in the course."
        );
      }
    });
  }

  return (
    <Button
      className="w-full cursor-pointer mb-3"
      onClick={enroll}
      disabled={isPending}
    >
      {isPending ? "Enrolling..." : "Enroll Now!"}
    </Button>
  );
}
