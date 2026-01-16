import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
});

export async function GET(
  _req: Request,
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

    const categories = await db.category.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.error("[CATEGORIES_GET]", e);
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
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        storeId: params.storeId,
        name: parsed.data.name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (e) {
    console.error("[CATEGORIES_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
