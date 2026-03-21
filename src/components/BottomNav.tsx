"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, CheckSquare, Map, User2 } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/trips", label: "概览", Icon: Map },
  { href: "/todos", label: "待办", Icon: CheckSquare },
  { href: "/timeline", label: "时间轴", Icon: CalendarClock },
  { href: "/me", label: "我", Icon: User2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto grid h-16 w-full max-w-xl grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "scale-105" : "")} />
              <span className="text-[11px] font-medium leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

