export default async function StorePage({ params }: { params: { storeId: string } }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const storeRes = await fetch(`${base}/api/public/stores/${params.storeId}`, {
    cache: "no-store",
  });

  if (!storeRes.ok) return <div style={{ padding: 24 }}>Store tidak ditemukan</div>;
  const store = await storeRes.json();

  const productsRes = await fetch(`${base}/api/public/stores/${params.storeId}/products`, {
    cache: "no-store",
  });
  const products = await productsRes.json();

  return (
    <div style={{ padding: 24 }}>
      <h1>{store.name}</h1>
      <h2>Produk</h2>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>
            {p.name} — Rp {p.price} (stok: {p.stock})
          </li>
        ))}
      </ul>
    </div>
  );
}
