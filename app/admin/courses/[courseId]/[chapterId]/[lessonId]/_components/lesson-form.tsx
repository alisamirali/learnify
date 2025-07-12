"use client";

import { updateLesson } from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/actions";
import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-upload/uploader";
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTryCatch } from "@/hooks/use-try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type LessonFormProps = {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
};

export function LessonForm({ data, chapterId, courseId }: LessonFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await useTryCatch(
        updateLesson(values, data.id)
      );

      if (error) {
        toast.error("An unexpected error occurred while updating the lesson.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push(`/admin/courses/${courseId}/edit`);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit/`}
        className={buttonVariants({
          variant: "outline",
          className: "mb-6",
        })}
      >
        <ArrowLeft className="size-4" />
        <span>Got Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>
            Lesson Configuration:{" "}
            <span className="text-primary">{data.title}</span>
          </CardTitle>
          <CardDescription>
            This is the configuration page for the lesson. You can edit the
            content, settings, and other properties of the lesson here.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Thumbnail</FormLabel>
                    <FormControl>
                      <Uploader
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video</FormLabel>
                    <FormControl>
                      <Uploader
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-fit cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Updating...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Update Lesson <PlusIcon className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
