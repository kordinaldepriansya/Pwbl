import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.coerce.number().int().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  sku: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(), // ✅
});

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const product = await db.product.findFirst({
      where: { id: params.productId, storeId: params.storeId },
    });
    if (!product) return new NextResponse("Not found", { status: 404 });

    return NextResponse.json(product);
  } catch (e) {
    console.error("[PRODUCT_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const existing = await db.product.findFirst({
      where: { id: params.productId, storeId: params.storeId },
      select: { id: true },
    });
    if (!existing) return new NextResponse("Not found", { status: 404 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await db.product.update({
      where: { id: params.productId },
      data: {
        ...parsed.data,
        sku: parsed.data.sku ?? null,
        description: parsed.data.description ?? null,
        categoryId: parsed.data.categoryId ?? null, // ✅
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PRODUCT_PATCH]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const deleted = await db.product.deleteMany({
      where: { id: params.productId, storeId: params.storeId },
    });

    if (deleted.count === 0) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("[PRODUCT_DELETE]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
