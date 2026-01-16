import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { cleanId } from "@/lib/ids";

// Optional: helper untuk debug token dari header Authorization
function debugAuth(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = cleanId(authHeader.replace(/^Bearer\s+/i, ""));

  console.log("AUTH header head:", authHeader.slice(0, 40));
  console.log("token head:", token.slice(0, 20));

  return { authHeader, token };
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  // ✅ DEBUG (hapus kalau sudah beres)
  debugAuth(req);

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ✅ pastikan store milik user
  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // ✅ whitelist field yang boleh diupdate
  const data: {
    name?: string;
    sku?: string | null;
    description?: string | null;
    price?: number;
    stock?: number;
    isActive?: boolean;
    categoryId?: string | null;
  } = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.sku !== undefined) data.sku = body.sku;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = body.price;
  if (body.stock !== undefined) data.stock = body.stock;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;

  try {
   
    const product = await db.product.update({
      where: {
        id: params.productId,
        
      },
      data,
    });

    

    return NextResponse.json(product);
  } catch (e: any) {
   
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {

  debugAuth(req);

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await db.store.findFirst({
    where: { id: params.storeId, userId },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  
  const found = await db.product.findFirst({
    where: { id: params.productId, storeId: params.storeId },
    select: { id: true },
  });

  if (!found) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  await db.product.delete({
    where: { id: params.productId },
  });

  return NextResponse.json({ ok: true });
}
