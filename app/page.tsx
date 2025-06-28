"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Successfully logged out!");
        },
      },
    });
  }

  return (
    <div>
      <ThemeToggle />

      {session ? (
        <div>
          <p>Welcome back, {session.user.email}!</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button onClick={() => router.push("/login")}>Log in</Button>
      )}
    </div>
  );
}
