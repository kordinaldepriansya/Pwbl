import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "./components/product-form";

export default async function ProductPage({
  params,
}: {
  params: { storeId: string; productId: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });
  if (!store) redirect("/");

  const [product, categories] = await Promise.all([
    db.product.findFirst({
      where: { id: params.productId, storeId: params.storeId },
    }),
    db.category.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) redirect(`/${params.storeId}/products`);

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-2" />

      <PageHeader title="Edit Product" description="Ubah informasi produk" />

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Detail Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            initialData={product}
            storeId={params.storeId}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
