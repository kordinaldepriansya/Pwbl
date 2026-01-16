import { formatter } from "../lib/utils";

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/stores/cmkh7xpj90000hymlqvafkd9u/products', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data produk');
  }

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="bg-white pb-10">
      <div className="relative overflow-hidden bg-slate-900 text-white py-16 mb-10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Toko Dinal
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Nikmati kelezatan masakan rumahan dengan bahan berkualitas terbaik. 
            Siap mengenyangkan perut Anda kapan saja.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold mb-8 text-slate-900">Menu Pilihan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {products.map((product: any) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-xl border border-gray-100 p-3 space-y-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden">
                 <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                 </div>
              </div>

              <div>
                <p className="font-semibold text-lg text-black group-hover:text-orange-600 transition">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.category?.name || "Menu Umum"}
                </p>
              </div>

              {/* Harga */}
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg text-slate-900">
                  {formatter.format(product.price)}
                </div>
              </div>
            </div>
          ))}

        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 space-y-4 text-gray-500">
            <p className="text-xl">Belum ada menu yang tersedia hari ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
