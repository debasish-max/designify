"use client"
import { Product } from '@/app/_components/PopularProducts'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/Button'
import Footer from '@/app/_components/Footer'

type CartItem = {
    documentId: string,
    products: Product[],
    design: string,
    id: number,
    quantity?: number
}

function Carts() {

    const { cart, setCart } = useContext(CartContext);
    const { userDetail } = useContext(UserDetailContext)
    const router = useRouter()

    const removeFromCart = async (documentId: string) => {
        const result = await axios.delete('/api/cart', {
            data: { documentId: documentId }
        });
        console.log(result.data);
        GetCartList();
    }

    const GetCartList = async () => {
        const result = await axios.get('/api/cart?email=' + userDetail?.email);
        setCart(result.data);
    }

    // ✅ Quantity state per item
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

    const getQuantity = (documentId: string) => quantities[documentId] ?? 1

    const updateQuantity = (documentId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [documentId]: Math.max(1, (prev[documentId] ?? 1) + delta)
        }))
    }

    const GetTotalCartAmount = () => {
        return cart?.reduce((total: number, cartItem: CartItem) => {
            const itemTotal = cartItem?.products?.reduce((sum, product) => sum + product.pricing, 0) ?? 0;
            const qty = getQuantity(cartItem.documentId)
            return total + (itemTotal * qty);
        }, 0) ?? 0;
    }

    return (
        <section>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <header className="text-center">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
                    </header>

                    <div className="mt-8">

                        {/* ✅ Empty cart message */}
                        {(!cart || cart.length === 0) && (
                            <div className="flex flex-col items-center justify-center gap-4 py-16">
                                <ShoppingBag className="w-16 h-16 text-gray-300" />
                                <h2 className="text-xl font-semibold text-gray-500">Your cart is empty</h2>
                                <p className="text-gray-400 text-sm">Looks like you haven't added anything yet</p>
                                <Button onClick={() => router.push('/')}>
                                    Browse Products
                                </Button>
                            </div>
                        )}

                        <ul className="space-y-4">
                            {cart?.map((cartItem: CartItem, index: number) => (
                                <li key={cartItem.documentId ?? index} className="flex items-center gap-4">
                                    {/* ✅ Product image */}
                                    {cartItem.products[0]?.productImage?.[0]?.url ? (
                                        <img
                                            src={cartItem.products[0].productImage[0].url}
                                            alt=""
                                            className="size-16 rounded-sm object-cover"
                                        />
                                    ) : (
                                        <div className="size-16 rounded-sm bg-muted flex items-center justify-center border border-dashed text-[10px] text-muted-foreground text-center leading-tight p-1">
                                            No Img
                                        </div>
                                    )}
                                    {/* ✅ Design image - only show if exists */}
                                    {cartItem.design && (
                                        <img
                                            src={cartItem.design}
                                            alt="design"
                                            className="size-16 rounded-sm object-cover"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h3 className="text-sm text-gray-900">{cartItem?.products[0]?.title}</h3>
                                        <p className="text-sm font-semibold text-gray-700">
                                            ₹{cartItem?.products[0]?.pricing}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* ✅ Quantity - and + buttons */}
                                        <button
                                            onClick={() => updateQuantity(cartItem.documentId, -1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full border hover:bg-gray-100"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm">
                                            {getQuantity(cartItem.documentId)}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(cartItem.documentId, 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full border hover:bg-gray-100"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <button
                                        className="text-gray-600 transition hover:text-red-600"
                                        onClick={() => removeFromCart(cartItem?.documentId)}
                                    >
                                        <span className="sr-only">Remove item</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {cart?.length > 0 && (
                            <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                                <div className="w-screen max-w-lg space-y-4">
                                    <dl className="space-y-0.5 text-sm text-gray-700">
                                        <div className="flex justify-between font-semibold">
                                            <dt>Total</dt>
                                            <dd>₹{GetTotalCartAmount()}</dd>
                                        </div>
                                    </dl>
                                    <div className="flex justify-end">
                                        <a
                                            onClick={() => {
                                                if (!userDetail?.email) {
                                                    toast.error("Please Sign In to continue")
                                                    router.push('/')
                                                    return
                                                }
                                                router.push('/checkout')
                                            }}
                                            className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600 cursor-pointer"
                                        >
                                            Checkout
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </section>
    )
}

export default Carts