"use client";

import { AdminCourseSingleType } from "@/app/data/admin/admin-get-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DeleteChapterModal } from "../_components/delete-chapter-modal";
import { DeleteLessonModal } from "../_components/delete-lesson-modal";
import { NewChapterModal } from "../_components/new-chapter-modal";
import { NewLessonModal } from "../_components/new-lesson-modal";
import { reorderChapters, reorderLessons } from "../actions";

type CourseStructureProps = {
  data: AdminCourseSingleType;
};

type SortableItemProps = {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string; // only for lessons
  };
};

export function CourseStructure({ data }: CourseStructureProps) {
  const initialItems =
    data.chapters
      .sort((a, b) => a.position - b.position) // Sort chapters by position
      .map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position, // Use position instead of order
        isOpen: true,
        lessons: chapter.lessons
          .sort((a, b) => a.position - b.position) // Sort lessons by position
          .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position, // Use position instead of order
          })),
      })) || [];

  const [items, setItems] = useState(initialItems);
  const isReorderingRef = useRef(false);

  // Only update state when data changes and we're not in the middle of reordering
  useEffect(() => {
    if (!isReorderingRef.current) {
      const newItems = data.chapters
        .sort((a, b) => a.position - b.position)
        .map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          position: chapter.position,
          isOpen: items.find((item) => item.id === chapter.id)?.isOpen ?? true, // Preserve open state
          lessons: chapter.lessons
            .sort((a, b) => a.position - b.position)
            .map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              position: lesson.position,
            })),
        }));
      setItems(newItems);
    }
  }, [data.chapters]);

  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle chapter reordering
    if (activeData?.type === "chapter" && overData?.type === "chapter") {
      isReorderingRef.current = true;

      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const previousItems = [...items]; // Capture current state for potential reversion
      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update state immediately
      setItems(newItems);

      // Update positions in database
      const chaptersWithNewPositions = newItems.map((chapter, index) => ({
        id: chapter.id,
        position: index + 1,
      }));

      reorderChapters(data.id, chaptersWithNewPositions).then((result) => {
        isReorderingRef.current = false;
        if (result.status === "error") {
          toast.error(result.message);
          // Revert the state if database update failed
          setItems(previousItems);
        } else {
          toast.success(result.message);
        }
      });
    }

    // Handle lesson reordering within the same chapter
    if (activeData?.type === "lesson" && overData?.type === "lesson") {
      const activeChapterId = activeData.chapterId;
      const overChapterId = overData.chapterId;

      // Only allow reordering within the same chapter
      if (activeChapterId === overChapterId) {
        isReorderingRef.current = true;

        const previousItems = [...items]; // Capture current state for potential reversion

        const newItems = items.map((chapter) => {
          if (chapter.id === activeChapterId) {
            const oldIndex = chapter.lessons.findIndex(
              (lesson) => lesson.id === active.id
            );
            const newIndex = chapter.lessons.findIndex(
              (lesson) => lesson.id === over.id
            );

            if (oldIndex === -1 || newIndex === -1) {
              return chapter;
            }

            const newLessons = arrayMove(chapter.lessons, oldIndex, newIndex);

            return {
              ...chapter,
              lessons: newLessons,
            };
          }
          return chapter;
        });

        // Update state immediately
        setItems(newItems);

        // Find the updated chapter to get the new lessons order
        const updatedChapter = newItems.find(
          (chapter) => chapter.id === activeChapterId
        );
        if (updatedChapter) {
          const lessonsWithNewPositions = updatedChapter.lessons.map(
            (lesson, index) => ({
              id: lesson.id,
              position: index + 1,
            })
          );

          reorderLessons(activeChapterId, lessonsWithNewPositions).then(
            (result) => {
              isReorderingRef.current = false;
              if (result.status === "error") {
                toast.error(result.message);
                // Revert the state if database update failed
                setItems(previousItems);
              } else {
                toast.success(result.message);
              }
            }
          );
        }
      }
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapterId === chapter.id
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  function handleChapterCreated(newChapter: {
    id: string;
    title: string;
    position: number;
  }) {
    const newChapterItem = {
      id: newChapter.id,
      title: newChapter.title,
      position: newChapter.position, // Use position instead of order
      isOpen: true,
      lessons: [],
    };
    setItems([...items, newChapterItem]);
  }

  function handleLessonCreated(newLesson: {
    id: string;
    title: string;
    position: number;
    chapterId: string;
  }) {
    setItems((prevItems) =>
      prevItems.map((chapter) => {
        if (chapter.id === newLesson.chapterId) {
          return {
            ...chapter,
            lessons: [
              ...chapter.lessons,
              {
                id: newLesson.id,
                title: newLesson.title,
                position: newLesson.position, // Use position instead of order
              },
            ].sort((a, b) => a.position - b.position), // Use position instead of order
          };
        }
        return chapter;
      })
    );
  }

  function handleLessonDeleted(deletedLessonId: string) {
    setItems((prevItems) =>
      prevItems.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.filter(
          (lesson) => lesson.id !== deletedLessonId
        ),
      }))
    );
  }

  function handleChapterDeleted(deletedChapterId: string) {
    setItems((prevItems) =>
      prevItems.filter((chapter) => chapter.id !== deletedChapterId)
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>

          <NewChapterModal
            courseId={data.id}
            onChapterCreated={handleChapterCreated}
          />
        </CardHeader>

        <CardContent className="space-y-5">
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={items.map((item) => item.id)}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-grab"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              className="flex items-center cursor-pointer"
                              variant="ghost"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>

                        <DeleteChapterModal
                          chapterId={item.id}
                          onChapterDeleted={handleChapterDeleted}
                        />
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{
                                  type: "lesson",
                                  chapterId: item.id,
                                }}
                              >
                                {(lessonsListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-grab"
                                        {...lessonsListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>

                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>

                                    <DeleteLessonModal
                                      lessonId={lesson.id}
                                      onLessonDeleted={handleLessonDeleted}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>

                          <div className="p-2 pb-0">
                            <NewLessonModal
                              chapterId={item.id}
                              courseId={data.id}
                              onLessonCreated={handleLessonCreated}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
