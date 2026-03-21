import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-xl items-center justify-between px-4 sm:px-6">
        <Link href="/trips" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">TripSync</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            MVP
          </span>
        </Link>
        <div className="text-xs text-muted-foreground">移动端优先</div>
      </div>
    </header>
  );
}

