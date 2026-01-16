"use client";

import Link from "next/link";

import { Menu } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";



  const routes = [
    { href: `/${storeId}`, label: "Overview" },
    { href: `/${storeId}/products`, label: "Products" },
    { href: `/${storeId}/settings`, label: "Settings" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-4">
        <div className="mb-4">
          <p className="text-sm font-semibold">Menu</p>
          <p className="text-sm text-muted-foreground">Navigasi toko</p>
        </div>

        <nav className="grid gap-1">
          {routes.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  active && "bg-muted text-foreground ring-1 ring-border"
                )}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
