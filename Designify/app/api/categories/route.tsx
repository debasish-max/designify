import { db } from "@/lib/db";
import { CategoriesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const categories = await db.select().from(CategoriesTable);
        return NextResponse.json(categories);
    } catch (e: any) {
        console.error('Categories API error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newCategory = await db.insert(CategoriesTable).values(data).returning();
        return NextResponse.json(newCategory[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, ...data } = await req.json();
        const updated = await db.update(CategoriesTable)
            .set(data)
            .where(eq(CategoriesTable.id, id))
            .returning();
        return NextResponse.json(updated[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        const deleted = await db.delete(CategoriesTable)
            .where(eq(CategoriesTable.id, id))
            .returning();
        return NextResponse.json(deleted[0]);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}