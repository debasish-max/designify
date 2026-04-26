"use client"
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import React from 'react'

function OrderSuccess() {
    const router = useRouter()

    return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
            <div className='flex flex-col items-center gap-4'>
                <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className='text-3xl font-bold text-gray-900'>Order Placed Successfully!</h1>
                <p className='text-gray-500 text-center'>Thank you for your order. We'll get it delivered to you soon.</p>
            </div>
            <Button
                onClick={() => router.push('/')}
                className='px-8 py-3 flex items-center gap-2'
            >
                Continue Shopping
            </Button>
        </div>
    )
}

export default OrderSuccess