import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Learning Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Learn smarter with our interactive platform — high-quality courses,
            expert instructors, and a vibrant learning community.
          </p>
        </div>
      </section>
    </>
  );
}
