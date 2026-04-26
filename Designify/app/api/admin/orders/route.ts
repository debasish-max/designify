import { db } from "@/lib/db";
import { OrdersTable } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allOrders = await db.select()
            .from(OrdersTable)
            .orderBy(desc(OrdersTable.createdAt));
        
        return NextResponse.json(allOrders);
    } catch (e: any) {
        console.error('Admin Orders API error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
