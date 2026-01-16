import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Navbar from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) redirect("/");

  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="hidden md:block">
            <div className="rounded-xl border bg-background/60 p-3 shadow-sm">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Navigasi
              </p>
              <SidebarNav />
              <Separator className="my-3" />
              <div className="px-3 pb-2">
                <p className="text-xs text-muted-foreground">
                  Store:{" "}
                  <span className="font-medium text-foreground">
                    {store.name}
                  </span>
                </p>
              </div>
            </div>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
