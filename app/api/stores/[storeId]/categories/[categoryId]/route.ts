import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const category = await db.category.findFirst({
      where: { id: params.categoryId, storeId: params.storeId },
    });
    if (!category) return new NextResponse("Not found", { status: 404 });

    return NextResponse.json(category);
  } catch (e) {
    console.error("[CATEGORY_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await db.category.updateMany({
      where: { id: params.categoryId, storeId: params.storeId },
      data: parsed.data,
    });

    if (updated.count === 0) return new NextResponse("Not found", { status: 404 });

    const category = await db.category.findFirst({
      where: { id: params.categoryId, storeId: params.storeId },
    });

    return NextResponse.json(category);
  } catch (e) {
    console.error("[CATEGORY_PATCH]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const deleted = await db.category.deleteMany({
      where: { id: params.categoryId, storeId: params.storeId },
    });

    if (deleted.count === 0) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("[CATEGORY_DELETE]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
