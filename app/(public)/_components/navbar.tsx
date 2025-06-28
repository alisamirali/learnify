"use client";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { navigationLinks } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto min-h-16 md:flex items-center px-4 md:px-6 lg:px-8 justify-between hidden">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center self-center gap-2 font-medium text-2xl w-fit"
          >
            <Image
              src="/logo.png"
              alt="Learnify Logo"
              width={40}
              height={40}
              className="size-10"
            />
            <span className="font-bold">Learnify.</span>
          </Link>

          <ul className="flex items-center space-x-4">
            {navigationLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isPending ? null : session ? (
            <UserDropdown
              avatar={session.user.image!}
              name={session.user.name}
              email={session.user.email}
            />
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Login
              </Link>
              <Link href="/login" className={buttonVariants()}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
