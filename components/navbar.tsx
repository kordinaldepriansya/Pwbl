import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import StoreSwitcher from "@/components/store-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandSearch } from "@/components/command-search";
import { Separator } from "@/components/ui/separator";

const Navbar = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const stores = await db.store.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-6">
        {/* Mobile menu */}
        <MobileNav />

        
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight">Admin</span>
          <Separator orientation="vertical" className="h-6" />
        </div>

        <StoreSwitcher items={stores} />

        {/* Search (desktop) */}
        <CommandSearch />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};
