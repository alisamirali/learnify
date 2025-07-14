import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/course-content";

type Params = Promise<{
  lessonId: string;
}>;

export default async function LessonPage({ params }: { params: Params }) {
  const { lessonId } = await params;
  const lesson = await getLessonContent(lessonId);

  return <CourseContent data={lesson} />;
}
