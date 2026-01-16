import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { ProductsClient } from "./components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });
  if (!store) redirect("/");

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      include: { category: { select: { id: true, name: true } } }, // ✅
    }),
    db.category.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Kelola produk toko Anda" />
      <ProductsClient
        initialData={products}
        storeId={params.storeId}
        categories={categories}
      />
    </div>
  );
};

export default ProductsPage;
