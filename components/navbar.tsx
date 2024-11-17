"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/cars",
    label: "Cars",
  },
  {
    href: "/imports",
    label: "Imports",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <Car className="h-6 w-6" />
          <span className="text-xl font-bold">Carpoint</span>
        </Link>

        <div className="hidden md:flex md:flex-1">
          <div className="flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 md:ml-auto">
          <ThemeToggle />
          <div className="hidden md:block">
            {session ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}