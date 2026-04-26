import { db } from "@/lib/db";
import { OrdersTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const orders = await db.select()
            .from(OrdersTable)
            .where(eq(OrdersTable.userEmail, email))
            .orderBy(desc(OrdersTable.createdAt));
        
        return NextResponse.json(orders);
    } catch (e: any) {
        console.error('Fetch orders error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userEmail, name, phone, zip, address, totalAmount, paymentId, paymentMethod } = await req.json();

        const newOrder = await db.insert(OrdersTable).values({
            userEmail,
            name,
            phone,
            zip,
            address,
            totalAmount: parseInt(totalAmount),
            paymentId,
            paymentMethod,
            status: 'pending' // default
        }).returning();

        return NextResponse.json(newOrder[0]);
    } catch (e: any) {
        console.error('Order creation error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}