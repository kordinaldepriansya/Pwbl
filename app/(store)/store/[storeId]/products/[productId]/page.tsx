import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeId(raw: string) {
  return decodeURIComponent(raw).trim();
}

export default async function ProductPublicPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) {
  const { storeId: rawStoreId, productId: rawProductId } = await params;
  const storeId = normalizeId(rawStoreId);
  const productId = normalizeId(rawProductId);

  const product = await db.product.findFirst({
    where: {
      id: productId,
      storeId,
      isActive: true,
    },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!product) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pastikan URL benar.
        </p>

        <div className="mt-4 space-y-2 rounded-lg border bg-muted/30 p-3 font-mono text-xs">
          <div>storeId: {storeId}</div>
          <div>productId: {productId}</div>
        </div>

        <Link
          href={`/store/${storeId}/products`}
          className="mt-6 inline-block rounded-xl border px-4 py-2 text-sm hover:bg-muted"
        >
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href={`/store/${storeId}/products`}
        className="inline-block text-sm text-primary underline"
      >
        ← Kembali
      </Link>

      <div className="rounded-2xl border
 
bg-card p-7 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.category?.name ?? "Tanpa kategori"}
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-xs">
            Stok: {product.stock}
          </span>
        </div>

        <p className="text-xl font-semibold">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <div className="pt-2 text-sm leading-relaxed text-muted-foreground">
          {product.description ?? "Tidak ada deskripsi."}
        </div>
      </div>
    </div>
  );
}
