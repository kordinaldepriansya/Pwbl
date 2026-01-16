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
