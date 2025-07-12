import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLesson } from "../actions";

export function NewLessonModal({
  courseId,
  chapterId,
  onLessonCreated,
}: {
  courseId: string;
  chapterId: string;
  onLessonCreated?: (newLesson: {
    id: string;
    title: string;
    position: number;
    chapterId: string;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  async function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await useTryCatch(createLesson(values));

      if (error) {
        toast.error("Failed to create lesson");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setOpen(false);

        // Call the callback to update the parent component's state
        if (onLessonCreated && result.data) {
          onLessonCreated({
            id: result.data.id,
            title: result.data.title,
            position: result.data.position,
            chapterId: result.data.chapterId,
          });
        }
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="outline" className="w-full gap-2">
          <Plus className="size-4" />
          Create New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Add a new lesson to your course. You can organize your content and
            structure your course effectively.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
