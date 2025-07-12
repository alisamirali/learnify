import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: { id: id },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if (!data) return notFound();

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
