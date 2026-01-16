import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanStoreId(input: string) {
  const decoded = decodeURIComponent(input);
  const trimmed = decoded.trim();

 
  const noInvisible = trimmed.replace(/[\u200B-\u200D\uFEFF\r\n\t ]+/g, "");

  
  const alnumOnly = (noInvisible.match(/[a-z0-9]+/gi)?.[0] ?? noInvisible).toLowerCase();

  return { decoded, trimmed, noInvisible, alnumOnly };
}

export default async function StorePublicHome({
  params,
}: {
  params: { storeId: string };
}) {
  const raw = params.storeId;
  const norm = cleanStoreId(raw);

  
  const store = await db.store.findUnique({
    where: { id: norm.alnumOnly },
    select: { id: true, name: true },
  });

  if (!store) {
   
    const stores = await db.store.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    
    const storeFallback = await db.store.findFirst({
      where: { id: norm.alnumOnly },
      select: { id: true, name: true },
    });

    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Toko tidak ditemukan</h1>

        <div className="mt-4 space-y-3 text-xs">
          <div>
            <div className="font-semibold">RAW params.storeId</div>
            <div className="rounded-lg border bg-muted/30 p-3 font-mono">
              {JSON.stringify(raw)} (len {raw.length})
            </div>
          </div>

          <div>
            <div className="font-semibold">Bersih (alnumOnly) dipakai query</div>
            <div className="rounded-lg border bg-muted/30 p-3 font-mono">
              {JSON.stringify(norm.alnumOnly)} (len {norm.alnumOnly.length})
            </div>
          </div>

          <div>
            <div className="font-semibold">Fallback findFirst result</div>
            <div className="rounded-lg border bg-muted/30 p-3 font-mono">
              {storeFallback ? `${storeFallback.id} / ${storeFallback.name}` : "null"}
            </div>
          </div>

          <div>
            <div className="font-semibold">5 toko terakhir yang terbaca di Next.js</div>
            <div className="space-y-2">
              {stores.map((s) => (
                <div key={s.id} className="rounded-lg border p-3">
                  <div className="font-mono">{JSON.stringify(s.id)} (len {s.id.length})</div>
                  <div className="text-muted-foreground">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl border px-4 py-2 text-sm hover:bg-muted">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold">{store.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Selamat datang di toko {store.name}.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/store/${store.id}/products`}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
