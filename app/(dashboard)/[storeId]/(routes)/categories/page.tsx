import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { CategoriesClient } from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });
  if (!store) redirect("/");

  const categories = await db.category.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Kelola kategori toko Anda" />
      <CategoriesClient initialData={categories} storeId={params.storeId} />
    </div>
  );
};

export default CategoriesPage;
