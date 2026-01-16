"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Package, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const params = useParams();
  const storeId = String(params.storeId);

  const routes = [
    {
      href: `/${storeId}`,
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === `/${storeId}`,
    },
    {
      href: `/${storeId}/products`,
      label: "Products",
      icon: Package,
      active: pathname.startsWith(`/${storeId}/products`),
    },
    {
      href: `/${storeId}/categories`,
      label: "Categories",
      icon: Tag,
      active: pathname.startsWith(`/${storeId}/categories`),
    },
    {
      href: `/${storeId}/settings`,
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith(`/${storeId}/settings`),
    },
  ];

  return (
    <nav className="grid gap-1">
      {routes.map((r) => {
        const Icon = r.icon;
        return (
          <Link
            key={r.href}
            href={r.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              r.active &&
                "bg-muted text-foreground ring-1 ring-border shadow-sm"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{r.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
