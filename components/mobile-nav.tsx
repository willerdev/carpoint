'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/cars",
    label: "All Cars",
    icon: Car,
  },
  {
    href: "/dashboard",
    label: "Orders",
    icon: FileText,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex h-16">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              pathname === tab.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
