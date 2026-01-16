"use client";

import { useState } from "react";
import type { Product } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryOption = { id: string; name: string };

type Props = {
  initialData: Product;
  storeId: string;
  categories: CategoryOption[];
};

export function ProductForm({ initialData, storeId, categories }: Props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData.name);
  const [sku, setSku] = useState(initialData.sku ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [price, setPrice] = useState<number>(initialData.price ?? 0);
  const [stock, setStock] = useState<number>(initialData.stock ?? 0);
  const [isActive, setIsActive] = useState<boolean>(initialData.isActive ?? true);

  // ✅ categoryId nullable
  const [categoryId, setCategoryId] = useState<string | null>(
    (initialData as any).categoryId ?? null
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/stores/${storeId}/products/${initialData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            sku: sku.trim() ? sku.trim() : null,
            description: description.trim() ? description.trim() : null,
            price,
            stock,
            isActive,
            categoryId,
          }),
        }
      );

      if (!res.ok) throw new Error((await res.text()) || "Gagal update produk");

      toast.success("Produk berhasil diupdate");
    } catch (err: any) {
      toast.error(err?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Nama</p>
          <Input
            className="h-10 rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Kategori</p>
          <Select
            value={categoryId ?? "none"}
            onValueChange={(v) => setCategoryId(v === "none" ? null : v)}
            disabled={loading}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">(Tanpa kategori)</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">SKU (opsional)</p>
          <Input
            className="h-10 rounded-xl"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={loading}
            placeholder="Contoh: SKU-001"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <p className="text-sm font-medium">Deskripsi (opsional)</p>
          <Textarea
            className="rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Tulis deskripsi produk..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Harga</p>
          <Input
            type="number"
            className="h-10 rounded-xl"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            disabled={loading}
            min={0}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Stok</p>
          <Input
            type="number"
            className="h-10 rounded-xl"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            disabled={loading}
            min={0}
          />
        </div>

        <div className="md:col-span-2 rounded-xl border p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Status Produk</p>
            <p className="text-xs text-muted-foreground">
              Jika nonaktif, produk tidak tampil di toko publik.
            </p>
          </div>

          <Switch checked={isActive} onCheckedChange={setIsActive} disabled={loading} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="rounded-xl" disabled={loading} type="submit">
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
