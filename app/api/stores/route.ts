import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { z } from "zod";

const createStoreSchema = z.object({
  name: z.string().min(1, "Nama toko wajib diisi"),
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    const stores = await db.store.findMany({
      where: {
        userId,
        ...(q
          ? {
              name: { contains: q, mode: "insensitive" },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("[STORES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const parsed = createStoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    // optional: mencegah nama toko sama (karena schema kamu @unique)
    const existing = await db.store.findUnique({ where: { name } });
    if (existing) {
      return new NextResponse("Nama toko sudah dipakai", { status: 409 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
      select: { id: true, name: true },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
