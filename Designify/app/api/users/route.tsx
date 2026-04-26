import { db } from "@/lib/db";
import { UsersTable } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await db.select().from(UsersTable);
        return NextResponse.json(users);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name, email, picture } = await req.json();

    try {
        // 1. Check if user already exists
        const existingUsers = await db.select()
            .from(UsersTable)
            .where(eq(UsersTable.email, email));

        if (existingUsers.length > 0) {
            return NextResponse.json(existingUsers[0]);
        }

        // 2. Count current users to determine role (First 3 are admins)
        const userCountResult = await db.select({ value: count() }).from(UsersTable);
        const userCount = Number(userCountResult[0].value);
        const role = userCount < 3 ? 'admin' : 'user';

        // 3. Create new user
        const newUser = await db.insert(UsersTable).values({
            name,
            email,
            picture,
            role
        }).returning();

        return NextResponse.json(newUser[0]);
    } catch (e: any) {
        console.error('User API error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}