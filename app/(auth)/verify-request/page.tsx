"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestRoute() {
  return (
    <Suspense>
      <VerifyRequestPage />
    </Suspense>
  );
}

function VerifyRequestPage() {
  const [otp, setOtp] = useState("");
  const [isOTPPending, startOTPTransition] = useTransition();
  const params = useSearchParams();
  const router = useRouter();

  const isOTPValid = otp.length === 6;

  const email = params.get("email") as string;

  function verifyOTP() {
    startOTPTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully verified email!");
            router.push("/");
          },
          onError: () => {
            toast.error("Failed to verify email.");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Check your email</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          We have sent you a verification code to your email. Please check your
          inbox and enter the code to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center flex-col gap-4">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-sm text-muted-foreground">
            Enter 6-digit code sent to your email
          </p>
        </div>

        <Button
          className="w-full cursor-pointer"
          onClick={verifyOTP}
          disabled={isOTPPending || !isOTPValid}
        >
          {isOTPPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
