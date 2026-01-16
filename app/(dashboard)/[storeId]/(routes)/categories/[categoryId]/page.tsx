import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "./components/category-form";

export default async function CategoryPage({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });
  if (!store) redirect("/");

  const category = await db.category.findFirst({
    where: { id: params.categoryId, storeId: params.storeId },
  });

  if (!category) redirect(`/${params.storeId}/categories`);

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-2" />

      <PageHeader title="Edit Category" description="Ubah nama kategori" />

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Detail Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm initialData={category} storeId={params.storeId} />
        </CardContent>
      </Card>
    </div>
  );
}
