import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct";
import { DollarSign, School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PublicCourseCard({ course }: { course: PublicCourseType }) {
  const thumbnailUrl = useConstructUrl(course.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>

      <Image
        src={thumbnailUrl}
        alt={course.title}
        width={600}
        height={400}
        className="w-full object-cover rounded-t-xl h-full aspect-video group-hover:opacity-90 transition-opacity duration-300"
      />

      <CardContent className="p-4">
        <Link
          title={course.title}
          href={`/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-1 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground mt-2 leading-tight">
          {course.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-6">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration}h</p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>

          <div className="flex items-center gap-x-2">
            <DollarSign className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.price}</p>
          </div>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className={buttonVariants({
            className: "mt-6 w-full",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}
