"use client";

import { useEffect, useMemo, useState } from "react";
import type { Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductModal } from "./product-modal";
import { ProductsTable } from "./products-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryOption = { id: string; name: string };

type ProductRow = Prisma.ProductGetPayload<{
  include: { category: { select: { id: true; name: true } } };
}>;

type Props = {
  initialData: ProductRow[];
  storeId: string;
  categories: CategoryOption[];
};

export function ProductsClient({ initialData, storeId, categories }: Props) {
  const [open, setOpen] = useState(false);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all"); // all | none | <id>
  const [data, setData] = useState<ProductRow[]>(initialData ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(initialData ?? []);
  }, [initialData]);

  useEffect(() => {
    const query = q.trim();

    // Kalau tidak search dan filter all, balikin initialData biar cepat
    if (!query && categoryId === "all") {
      setLoading(false);
      setData(initialData ?? []);
      return;
    }

    setLoading(true);

    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (categoryId) params.set("categoryId", categoryId);

        const res = await fetch(
          `/api/stores/${storeId}/products?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(await res.text());

        const products = (await res.json()) as ProductRow[];
        setData(products);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [q, categoryId, storeId, initialData]);

  const helperText = useMemo(() => {
    const query = q.trim();
    const isFiltering = categoryId !== "all";
    if (!query && !isFiltering) return "";

    if (loading) return "Memuat...";
    if (query && isFiltering) return `Filter: "${query}" + kategori`;
    if (query) return `Hasil untuk: "${query}"`;
    return "Filter kategori aktif";
  }, [q, categoryId, loading]);

  const handleCreated = (product: ProductRow) => {
    setQ("");
    setCategoryId("all");
    setData((prev) => [product, ...(prev ?? [])]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <Input
              className="h-10 rounded-xl sm:w-[280px]"
              placeholder="Cari produk..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {helperText ? (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Kategori</p>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-10 rounded-xl sm:w-[220px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="none">Tanpa kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="rounded-xl" onClick={() => setOpen(true)}>
          Tambah Produk
        </Button>
      </div>

      <ProductModal
        open={open}
        onOpenChange={setOpen}
        storeId={storeId}
        categories={categories}
        onCreated={handleCreated}
      />

      <ProductsTable data={data} storeId={storeId} />
    </div>
  );
}
