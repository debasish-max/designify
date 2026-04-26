import { db } from "@/lib/db";
import { CartTable, ProductsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const cartItems = await db.select({
            id: CartTable.id,
            designUrl: CartTable.designUrl,
            userEmail: CartTable.userEmail,
            product: ProductsTable
        })
        .from(CartTable)
        .leftJoin(ProductsTable, eq(CartTable.productId, ProductsTable.id))
        .where(eq(CartTable.userEmail, email));

        // Format to match legacy Strapi structure if needed
        const formattedData = cartItems.map(item => ({
            id: item.id,
            design: item.designUrl,
            products: [item.product] // frontend expects products array
        }));

        return NextResponse.json(formattedData);
    } catch (e: any) {
        console.error('Cart GET error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userEmail, designUrl, product } = await req.json();

        const newCartItem = await db.insert(CartTable).values({
            userEmail,
            designUrl,
            productId: product?.id || product?.documentId // handle both numeric and documentId
        }).returning();

        return NextResponse.json(newCartItem[0]);
    } catch (e: any) {
        console.error('Cart POST error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        const deleted = await db.delete(CartTable)
            .where(eq(CartTable.id, id))
            .returning();
        
        return NextResponse.json(deleted[0]);
    } catch (e: any) {
        console.error('Cart DELETE error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}