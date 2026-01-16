import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId: rawStoreId } = await params;

  const cleaned = decodeURIComponent(rawStoreId)
    .replace(/[\u200B-\u200D\uFEFF\r\n\t ]+/g, "")
    .trim();

  const products = await db.$queryRaw<
    Array<{
      id: string;
      name: string;
      price: number;
      stock: number;
      description: string | null;
      isActive: boolean;
    }>
  >`
    SELECT p.id, p.name, p.price, p.stock, p.description, p."isActive"
    FROM "Product" p
    JOIN "Store" s ON p."storeId" = s.id
    WHERE regexp_replace(s.id, '[\\s\\u200B-\\u200D\\uFEFF]+', '', 'g') = ${cleaned}
      AND p."isActive" = true
    ORDER BY p."createdAt" DESC
  `;

  return NextResponse.json(products);
}
