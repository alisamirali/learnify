"use client";

import { LessonItem } from "@/app/dashboard/_components/lesson-item";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { ChevronDown, Play } from "lucide-react";
import { usePathname } from "next/navigation";

type CourseSidebarProps = {
  course: CourseSidebarDataType["course"];
};

export function CourseSidebar({ course }: CourseSidebarProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: course });

  return (
    <div className="w-80 border-r border-border shrink-0">
      <div className="flex h-full flex-col">
        <div className="pb-4 pr-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Play className="size-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base leading-tight truncate">
                {course.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {course.category}
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>

            <Progress value={progressPercentage} max={100} />
            <p className="text-xs text-muted-foreground">
              {progressPercentage}% Complete
            </p>
          </div>
        </div>

        <div className="py-4 pr-4 space-y-3">
          {course.chapters.map((chapter, index) => (
            <Collapsible key={chapter.id} defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full p-3 h-auto flex items-center gap-2 cursor-pointer truncate"
                  title={course.title}
                >
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {chapter.position}: {chapter.title}
                    </p>

                    <p className="text-[10px] text-muted-foreground mt-1 font-medium truncate">
                      {chapter.lessons.length} lesson
                      {chapter.lessons.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <ChevronDown className="size-4 text-primary" />
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                {chapter.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    slug={course.slug}
                    isActive={lesson.id === currentLessonId}
                    completed={
                      lesson.lessonProgress.find(
                        (progress) => progress.lessonId === lesson.id
                      )?.completed || false
                    }
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
