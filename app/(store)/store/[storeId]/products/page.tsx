import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeId(raw: string) {
  return decodeURIComponent(raw).trim();
}

export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId: rawStoreId } = await params;
  const storeId = normalizeId(rawStoreId);

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { id: true, name: true },
  });

  if (!store) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Toko tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          storeId:
        </p>
        <div className="mt-2 rounded-lg border bg-muted/30 p-3 font-mono text-xs">
          {storeId}
        </div>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl border px-4 py-2 text-sm hover:bg-muted"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const products = await db.product.findMany({
    where: {
      storeId,
      isActive: true,
      // kalau mau hanya stok > 0:
      // stock: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { id: true, name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produk {store.name}</h1>
          <p className="text-sm text-muted-foreground">
            Pilih produk yang kamu inginkan
          </p>
        </div>

        <Link
          href={`/store/${store.id}`}
          className="w-fit rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Beranda Toko
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Belum ada produk aktif.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/store/${store.id}/products/${p.id}`}
              className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.category?.name ?? "Tanpa kategori"}
                  </p>
                </div>

                <span className="rounded-full border px-2 py-1 text-[11px]">
                  Stok: {p.stock}
                </span>
              </div>

              <div className="mt-4 text-lg font-bold">
                Rp {p.price.toLocaleString("id-ID")}
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {p.description ?? "Tidak ada deskripsi."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
