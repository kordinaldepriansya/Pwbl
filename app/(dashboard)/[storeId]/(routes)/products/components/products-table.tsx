"use client";

import type { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ProductActions } from "./product-actions";

type ProductRow = Prisma.ProductGetPayload<{
  include: { category: { select: { id: true; name: true } } };
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductsTable({
  data,
  storeId,
}: {
  data: ProductRow[];
  storeId: string;
}) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Belum ada produk
              </TableCell>
            </TableRow>
          ) : (
            data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>

                <TableCell className="text-muted-foreground">
                  {p.category?.name ?? "-"}
                </TableCell>

                <TableCell>{formatRupiah(p.price)}</TableCell>
                <TableCell>{p.stock}</TableCell>

                <TableCell>
                  {p.isActive ? (
                    <Badge className="rounded-lg">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-lg">
                      Nonaktif
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <ProductActions storeId={storeId} productId={p.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
