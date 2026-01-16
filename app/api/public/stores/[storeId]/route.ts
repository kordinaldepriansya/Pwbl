import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cleanId } from "@/lib/ids";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  const storeId = cleanId(params.storeId);

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { id: true, name: true },
  });

  if (!store) {
    return NextResponse.json(
      { message: "Store not found", storeId },
      { status: 404 }
    );
  }

  return NextResponse.json(store);
}
