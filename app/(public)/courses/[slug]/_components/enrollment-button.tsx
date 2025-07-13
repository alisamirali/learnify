"use client";

import { Button } from "@/components/ui/button";
import { useTryCatch } from "@/hooks/use-try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourse } from "../actions";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function enroll() {
    startTransition(async () => {
      const { data: result, error } = await useTryCatch(
        enrollInCourse(courseId)
      );

      if (error) {
        toast.error(
          "An unexpected error occurred while enrolling in the course."
        );
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
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
