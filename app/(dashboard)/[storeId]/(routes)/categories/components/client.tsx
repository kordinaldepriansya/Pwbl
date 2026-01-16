"use client";

import { useState } from "react";
import type { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { CategoryModal } from "./category-modal";
import { CategoriesTable } from "./categories-table";

export function CategoriesClient({
  initialData,
  storeId,
}: {
  initialData: Category[];
  storeId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button className="rounded-xl" onClick={() => setOpen(true)}>
          Tambah Kategori
        </Button>
      </div>

      <CategoryModal open={open} onOpenChange={setOpen} storeId={storeId} />

      <CategoriesTable data={initialData} storeId={storeId} />
    </div>
  );
}
