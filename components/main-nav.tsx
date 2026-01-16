"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const storeId = String(params.storeId);

  const routes = [
    {
      href: `/${storeId}`,
      label: "Overview",
      active: pathname === `/${storeId}`,
    },
    {
      href: `/${storeId}/products`,
      label: "Products",
      active: pathname.startsWith(`/${storeId}/products`), // ✅ termasuk /products/[productId]
    },
    {
      href: `/${storeId}/categories`,
      label: "Categories",
      active: pathname.startsWith(`/${storeId}/categories`), // ✅ termasuk /categories/[categoryId]
    },
    {
      href: `/${storeId}/settings`,
      label: "Settings",
      active: pathname.startsWith(`/${storeId}/settings`),
    },
  ];

  return (
    <nav className={cn("flex items-center gap-1", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            route.active &&
              "bg-muted text-foreground shadow-sm ring-1 ring-border"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
