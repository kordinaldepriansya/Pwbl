"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "": "Overview",
  settings: "Settings",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams();

  const storeId = params.storeId as string;
  const base = `/${storeId}`;

  // contoh pathname: /abc/settings -> segments: ["settings"]
  const segments = pathname.replace(base, "").split("/").filter(Boolean);

  const crumbs = [
    { href: base, label: "Dashboard" },
    ...segments.map((seg, idx) => {
      const href = `${base}/${segments.slice(0, idx + 1).join("/")}`;
      const label = LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
      return { href, label };
    }),
  ];

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Link href={base} className="flex items-center gap-2 hover:text-foreground">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {crumbs.map((c, i) => (
        <div key={c.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 opacity-60" />
          <Link
            href={c.href}
            className={cn(
              "hover:text-foreground",
              i === crumbs.length - 1 && "text-foreground font-medium"
            )}
          >
            {c.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
