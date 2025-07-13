"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center flex-1 justify-center">
      <Card className="max-w-md">
        <CardContent>
          <div className="w-full flex items-center justify-center">
            <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>

          <div className="text-center mt-3 sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-muted-foreground mt-2 tracking-tight">
              Your payment has been processed successfully. Thank you for your
              purchase!
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                className: "w-full mt-5",
              })}
            >
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
