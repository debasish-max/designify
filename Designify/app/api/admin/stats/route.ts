import { db } from "@/lib/db";
import { OrdersTable, ProductsTable } from "@/lib/db/schema";
import { desc, sum, count, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Aggregating statistics
        const [revenueResult] = await db.select({ total: sum(OrdersTable.totalAmount) }).from(OrdersTable);
        const [ordersCountResult] = await db.select({ total: count() }).from(OrdersTable);
        const [productsCountResult] = await db.select({ total: count() }).from(ProductsTable);

        // Fetching monthly revenue (last 6 months)
        const monthlyRevenue = await db.execute(sql`
            SELECT 
                to_char(date_trunc('month', ${OrdersTable.createdAt}), 'Mon') as name,
                SUM(${OrdersTable.totalAmount})::int as revenue
            FROM ${OrdersTable}
            WHERE ${OrdersTable.createdAt} >= NOW() - INTERVAL '6 months'
            GROUP BY 1
            ORDER BY MIN(${OrdersTable.createdAt})
        `);

        // Fetching category distribution
        const categoryDistribution = await db.select({
            name: ProductsTable.categoryName,
            value: count()
        })
        .from(ProductsTable)
        .groupBy(ProductsTable.categoryName);

        // Fetching recent orders
        const recentOrders = await db.select()
            .from(OrdersTable)
            .orderBy(desc(OrdersTable.createdAt))
            .limit(5);

        return NextResponse.json({
            totalRevenue: Number(revenueResult.total || 0),
            totalOrders: Number(ordersCountResult.total || 0),
            totalProducts: Number(productsCountResult.total || 0),
            monthlyRevenue: monthlyRevenue.rows,
            categoryDistribution,
            recentOrders
        });
    } catch (e: any) {
        console.error('Admin Stats API error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
