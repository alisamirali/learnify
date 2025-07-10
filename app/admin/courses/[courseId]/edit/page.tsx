import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseStructure } from "./_components/course-structure";
import { EditCourseForm } from "./_components/edit-course-form";

type Params = Promise<{
  courseId: string;
}>;

export default async function EditCoursesPage({ params }: { params: Params }) {
  const { courseId } = await params;

  const data = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        Edit Course:{" "}
        <span className="text-primary underline">{data.title}</span>
      </h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info" className="cursor-pointer">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="course-structure" className="cursor-pointer">
            Course Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Course Information</CardTitle>
              <CardDescription>
                Edit the basic information of your course, such as title,
                description, and thumbnail.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Edit the structure of your course, including modules and
                lessons.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
