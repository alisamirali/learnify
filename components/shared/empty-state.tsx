import { buttonVariants } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

export function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-6 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {buttonText && (
        <Link
          className={buttonVariants({ className: "mt-4" })}
          href={buttonLink || ""}
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
