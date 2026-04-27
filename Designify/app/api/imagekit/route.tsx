import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function POST(req: NextRequest) {
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
        console.error('ImageKit keys are missing from .env.local');
        return NextResponse.json({ error: 'Image storage is not configured' }, { status: 500 });
    }

    const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,      // ✅ safe on server
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string;

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            useUniqueFileName: false,
            isPublished: true,
        });

        return NextResponse.json({ url: result.url });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}