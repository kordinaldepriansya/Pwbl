import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const storeCount = await db.store.count();

  const firstStore = await db.store.findFirst({
    select: { id: true, name: true, userId: true },
    orderBy: { createdAt: "desc" },
  });

  const storeId = firstStore?.id ?? null;

  const baseApi = "http://localhost:3000";
  const baseFrontend = "http://localhost:3001";

  return NextResponse.json({
    ok: true,
    storeCount,
    firstStore,
    links: storeId
      ? {
          publicStore: `${baseApi}/api/public/stores/${storeId}`,
          publicProducts: `${baseApi}/api/public/stores/${storeId}/products`,
          frontendStore: `${baseFrontend}/store/${storeId}`,
        }
      : null,
  });
}
