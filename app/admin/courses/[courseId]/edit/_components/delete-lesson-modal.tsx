import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteLesson } from "../actions";

export function DeleteLessonModal({
  lessonId,
  onLessonDeleted,
}: {
  lessonId: string;
  onLessonDeleted?: (deletedLessonId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  async function onDelete() {
    startTransition(async () => {
      try {
        const result = await deleteLesson(lessonId);

        if (result.status === "success") {
          toast.success(result.message);
          setOpen(false);

          // Call the callback to update the parent component's state
          if (onLessonDeleted) {
            onLessonDeleted(lessonId);
          }
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to delete lesson");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <TrashIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Lesson</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this lesson? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
