import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    const { amount } = await req.json();

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // convert to paise
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        });

        return NextResponse.json(order);
    } catch (e: any) {
        console.error('Razorpay error:', e);
        return NextResponse.json(e, { status: 500 });
    }
}