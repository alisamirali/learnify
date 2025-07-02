import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/50 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="max-w-sm mx-auto">
            You are not authorized to access this page. Please contact your
            administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
