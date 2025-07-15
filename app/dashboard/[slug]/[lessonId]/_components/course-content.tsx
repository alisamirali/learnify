"use client";

import { markLessonAsCompleted } from "@/app/dashboard/[slug]/[lessonId]/actions";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/hooks/use-confetti";
import { useConstructUrl } from "@/hooks/use-construct";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type LessonItemProps = {
  data: LessonContentType;
};

export function CourseContent({ data }: LessonItemProps) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function handleMarkAsCompleted() {
    startTransition(async () => {
      try {
        const result = await markLessonAsCompleted(
          data.id,
          data.Chapter.Course.slug
        );

        if (result.status === "success") {
          toast.success(result.message);
          triggerConfetti();
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error(
          "An unexpected error occurred while marking the lesson as completed."
        );
      }
    });
  }
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-4 border-b flex items-center justify-end">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 cursor-not-allowed hover:text-green-600"
          >
            <CheckCircle className="size-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleMarkAsCompleted}
            disabled={isPending}
          >
            {isPending ? (
              "Processing..."
            ) : (
              <>
                <CheckCircle className="size-4 text-green-500" />
                Mark as Completed
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-4 pt-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h2>

        {data.description ? (
          <>
            <p className="mb-2 text-base font-medium">Description:</p>
            <RenderDescription json={JSON.parse(data.description)} />
          </>
        ) : (
          <p className="text-base text-muted-foreground">
            No description available.
          </p>
        )}
      </div>
    </div>
  );
}

type VideoPlayerProps = {
  thumbnailKey: string;
  videoKey: string;
};

function VideoPlayer({ thumbnailKey, videoKey }: VideoPlayerProps) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  if (!videoKey) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center flex-col justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          No video available for this lesson. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative">
      <video
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        poster={thumbnailUrl}
        className="w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
