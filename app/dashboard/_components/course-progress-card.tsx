"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";

export function CourseProgressCard({ course }: { course: EnrolledCourseType }) {
  const thumbnailUrl = useConstructUrl(course.Course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: course.Course });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">
        {course.Course.level}
      </Badge>

      <Image
        src={thumbnailUrl}
        alt={course.Course.title}
        width={600}
        height={400}
        className="w-full object-cover rounded-t-xl h-full aspect-video group-hover:opacity-90 transition-opacity duration-300"
      />

      <CardContent className="p-4">
        <Link
          title={course.Course.title}
          href={`/courses/${course.Course.slug}`}
          className="font-medium text-lg line-clamp-1 hover:underline group-hover:text-primary transition-colors"
        >
          {course.Course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground mt-2 leading-tight">
          {course.Course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex items-center justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground tracking-tight mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${course.Course.slug}`}
          className={buttonVariants({
            className: "mt-6 w-full",
          })}
        >
          Watch Course
        </Link>
      </CardContent>
    </Card>
  );
}
