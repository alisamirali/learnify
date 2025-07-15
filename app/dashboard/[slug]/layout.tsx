import { CourseSidebar } from "@/app/dashboard/_components/course-sidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

export default async function ViewCourseLayout({
  params,
  children,
}: DashboardLayoutProps) {
  const { slug } = await params;

  const data = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1 md:flex-row flex-col-reverse">
      <CourseSidebar course={data.course} />

      <Separator className="block md:hidden my-6" />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
