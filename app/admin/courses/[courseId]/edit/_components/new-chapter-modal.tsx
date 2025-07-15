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
import { chapterSchema, ChapterSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createChapter } from "../actions";

export function NewChapterModal({
  courseId,
  onChapterCreated,
}: {
  courseId: string;
  onChapterCreated?: (newChapter: {
    id: string;
    title: string;
    position: number;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  async function onSubmit(values: ChapterSchemaType) {
    startTransition(async () => {
      try {
        const result = await createChapter(values);

        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          setOpen(false);

          // Call the callback to update the parent component's state
          if (onChapterCreated && result.data) {
            onChapterCreated({
              id: result.data.id,
              title: result.data.title,
              position: result.data.position,
            });
          }
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to create chapter");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="outline" className="gap-2" size="sm">
          <Plus className="size-4" />
          New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to your course. You can organize your content and
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
                  <FormLabel>Chapter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter chapter name" {...field} />
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
                {isPending ? "Creating..." : "Create Chapter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
