import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  const storeId = params.storeId;


  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json(
      { message: "Store not found", storeId },
      { status: 404 }
    );
  }

  const products = await db.product.findMany({
    where: {
      storeId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
