import { db } from "@/lib/db";
import { ProductsTable } from "@/lib/db/schema";
import { eq, ilike, and, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const isPopular = searchParams.get('isPopular');
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');
    const search = searchParams.get('search');

    try {
        if (productId) {
            const idAsInt = parseInt(productId);
            const result = await db.select()
                .from(ProductsTable)
                .where(
                    isNaN(idAsInt)
                    ? eq(ProductsTable.documentId, productId)
                    : or(
                        eq(ProductsTable.id, idAsInt),
                        eq(ProductsTable.documentId, productId)
                    )
                );
            return NextResponse.json(result[0] || null);
        }

        let query = db.select().from(ProductsTable).$dynamic();

        if (isPopular === '1') {
            query = query.where(eq(ProductsTable.isPopular, true));
        } else if (category) {
            query = query.where(eq(ProductsTable.categoryName, category));
        } else if (search) {
            query = query.where(ilike(ProductsTable.title, `%${search}%`));
        }

        const products = await query;
        return NextResponse.json(products);

    } catch (e: any) {
        console.error('Products API error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newProduct = await db.insert(ProductsTable).values({
            ...data,
            documentId: Math.random().toString(36).substring(7)
        }).returning();
        return NextResponse.json(newProduct[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, ...data } = await req.json();
        const updated = await db.update(ProductsTable)
            .set(data)
            .where(eq(ProductsTable.id, id))
            .returning();
        return NextResponse.json(updated[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        const deleted = await db.delete(ProductsTable)
            .where(eq(ProductsTable.id, id))
            .returning();
        return NextResponse.json(deleted[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}