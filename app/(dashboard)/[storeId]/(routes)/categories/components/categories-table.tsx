"use client";

import type { Category } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryActions } from "./category-actions";

export function CategoriesTable({
  data,
  storeId,
}: {
  data: Category[];
  storeId: string;
}) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead className="w-[60px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Belum ada kategori
              </TableCell>
            </TableRow>
          ) : (
            data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-right">
                  <CategoryActions storeId={storeId} categoryId={c.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
