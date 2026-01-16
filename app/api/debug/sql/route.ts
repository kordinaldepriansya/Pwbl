import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {

  const schema = await db.$queryRaw<Array<{ schema: string }>>`
    SELECT current_schema() as schema
  `;


  const tables = await db.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema()
    ORDER BY tablename
  `;

 
  const fromStoreLower = await db.$queryRaw<Array<{ id: string; name: string }>>`
    SELECT id, name FROM store LIMIT 5
  `.catch(() => []);

  const fromStoreCapital = await db.$queryRaw<Array<{ id: string; name: string }>>`
    SELECT id, name FROM "Store" LIMIT 5
  `.catch(() => []);

  const fromStores = await db.$queryRaw<Array<{ id: string; name: string }>>`
    SELECT id, name FROM stores LIMIT 5
  `.catch(() => []);

  const fromStoresCapital = await db.$queryRaw<Array<{ id: string; name: string }>>`
    SELECT id, name FROM "stores" LIMIT 5
  `.catch(() => []);

  return NextResponse.json({
  schema: schema?.[0]?.schema ?? null,
  tables: tables.map((t) => t.tablename),
  samples: {
    store_lower: fromStoreLower,
    Store_capital: fromStoreCapital,
    stores_lower: fromStores,
    stores_quoted: fromStoresCapital,
  },
});

}
