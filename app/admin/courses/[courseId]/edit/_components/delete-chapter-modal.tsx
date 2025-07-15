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
import { deleteChapter } from "../actions";

export function DeleteChapterModal({
  chapterId,
  onChapterDeleted,
}: {
  chapterId: string;
  onChapterDeleted?: (deletedChapterId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  async function onDelete() {
    startTransition(async () => {
      try {
        const result = await deleteChapter(chapterId);

        if (result.status === "success") {
          toast.success(result.message);
          setOpen(false);

          // Call the callback to update the parent component's state
          if (onChapterDeleted) {
            onChapterDeleted(chapterId);
          }
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      } catch {
        toast.error("Failed to delete chapter");
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
          <DialogTitle>Delete Chapter</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chapter? This will also delete
            all lessons within this chapter. This action cannot be undone.
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
            {isPending ? "Deleting..." : "Delete Chapter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
