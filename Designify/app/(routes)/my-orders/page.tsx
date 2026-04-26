"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import { Package, Calendar, CreditCard, MapPin, Loader2, ShoppingBag, LogIn } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/app/_components/Footer'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

type Order = {
    documentId: string
    userEmail: string
    name: string
    phone: string
    zip: string
    address: string
    totalAmount: number
    paymentId: string
    paymentMethod: string
    createdAt: string
}

function MyOrders() {
    const { userDetail } = useContext(UserDetailContext)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (userDetail?.email) {
            fetchOrders()
        } else {
            setLoading(false)
        }
    }, [userDetail])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const result = await axios.get('/api/orders?email=' + userDetail?.email)
            setOrders(result.data ?? [])
        } catch (e) {
            console.error('Failed to fetch orders:', e)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getPaymentBadge = (method: string) => {
        if (method === 'cod') return { label: 'Cash on Delivery', color: 'bg-amber-100 text-amber-800 border-amber-200' }
        return { label: 'Online Payment', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    }

    // Not signed in
    if (!userDetail) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <LogIn className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Sign in to view your orders</h1>
                        <p className="text-gray-500 max-w-sm">Please sign in with your Google account to access your order history.</p>
                    </div>
                    <Button onClick={() => router.push('/')} className="px-8 py-3">
                        Go to Home
                    </Button>
                </div>
                <Footer />
            </div>
        )
    }

    // Loading
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Loading your orders...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header Banner */}
            <div className="mt-3 rounded-xl bg-primary p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white">My Orders</h1>
                        <p className="text-white/70 text-sm">
                            {orders.length > 0
                                ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}`
                                : 'Your order history will appear here'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-8 px-2 md:px-0">
                {/* Empty State */}
                {orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-5 py-20"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold text-gray-600">No orders yet</h2>
                            <p className="text-gray-400 text-sm max-w-xs">
                                When you place an order, it will appear here for you to track.
                            </p>
                        </div>
                        <Button onClick={() => router.push('/products')} className="px-8 py-3">
                            Start Shopping
                        </Button>
                    </motion.div>
                )}

                {/* Orders List */}
                <AnimatePresence>
                    <div className="space-y-4">
                        {orders.map((order, index) => {
                            const badge = getPaymentBadge(order.paymentMethod)
                            return (
                                <motion.div
                                    key={order.documentId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
                                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Top accent line */}
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

                                    <div className="p-5 md:p-6">
                                        {/* Header Row */}
                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Package className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                                                        Order #{order.documentId?.slice(-8).toUpperCase()}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(order.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${badge.color}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50">
                                            {/* Total */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                    <CreditCard className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                                                    <p className="font-bold text-gray-900 text-lg">₹{order.totalAmount}</p>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="flex items-start gap-3 sm:col-span-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {order.name} · {order.phone}<br />
                                                        {order.address}, {order.zip}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </AnimatePresence>
            </div>
            <Footer />
        </div>
    )
}

export default MyOrders
