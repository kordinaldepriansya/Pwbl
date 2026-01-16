import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  price: z.coerce.number().int().min(0).default(0),
  stock: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const store = await db.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const categoryIdParam = (searchParams.get("categoryId") ?? "").trim(); // ✅

    const categoryFilter =
      !categoryIdParam || categoryIdParam === "all"
        ? {}
        : categoryIdParam === "none"
          ? { categoryId: null }
          : { categoryId: categoryIdParam };

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        ...categoryFilter,
      },
      orderBy: { createdAt: "desc" },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, sku, description, categoryId, price, stock, isActive } =
      parsed.data;

    // ✅ Validasi categoryId (kalau dikirim) harus milik store yang sama
    if (categoryId) {
      const category = await db.category.findFirst({
        where: { id: categoryId, storeId: params.storeId },
        select: { id: true },
      });
      if (!category) {
        return new NextResponse("Invalid categoryId", { status: 400 });
      }
    }

    const product = await db.product.create({
      data: {
        storeId: params.storeId,
        name,
        sku: sku ?? null,
        description: description ?? null,
        categoryId: categoryId ?? null,
        price,
        stock,
        isActive,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
