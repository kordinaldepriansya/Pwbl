"use client";

import { useState } from "react";
import type { Category } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm({
  initialData,
  storeId,
}: {
  initialData: Category;
  storeId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData.name);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/stores/${storeId}/categories/${initialData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!res.ok) throw new Error((await res.text()) || "Gagal update kategori");

      toast.success("Kategori berhasil diupdate");
    } catch (err: any) {
      toast.error(err?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Nama</p>
        <Input
          className="h-10 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end">
        <Button className="rounded-xl" disabled={loading} type="submit">
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
