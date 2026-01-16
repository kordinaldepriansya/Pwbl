import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  const store = await db.store.findFirst({
    where: { id: params.storeId },
    select: { id: true, name: true, userId: true },
  });

  return NextResponse.json({
    storeIdFromUrl: params.storeId,
    found: !!store,
    store,
  });
}
