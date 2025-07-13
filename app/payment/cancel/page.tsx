import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="w-full min-h-screen flex items-center flex-1 justify-center">
      <Card className="max-w-md">
        <CardContent>
          <div className="w-full flex items-center justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>

          <div className="text-center mt-3 sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-muted-foreground mt-2 tracking-tight">
              Your payment has been cancelled. If you have any questions or need
              assistance, please contact support.
            </p>
            <Link
              href="/"
              className={buttonVariants({
                className: "w-full mt-5",
              })}
            >
              Go to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
