"use client"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { ArrowRight } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import Footer from '@/app/_components/Footer'

type CartItem = {
    documentId: string,
    products: { pricing: number }[],
    design: string,
    id: number
}

function Checkout() {

    const { cart, setCart } = useContext(CartContext)
    const { userDetail } = useContext(UserDetailContext)
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [zip, setZip] = useState('')
    const [address, setAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod')
    const [loading, setLoading] = useState(false)

    const GetSubtotal = () => {
        return cart?.reduce((total: number, cartItem: CartItem) => {
            const itemTotal = cartItem?.products?.reduce((sum, product) => sum + product.pricing, 0) ?? 0;
            return total + itemTotal;
        }, 0) ?? 0;
    }

    const GetDelivery = () => cart?.length > 0 ? 15 : 0;

    const GetTotal = () => (GetSubtotal() + GetDelivery()).toFixed(0);

    const saveOrder = async (paymentId: string = 'COD') => {
        await axios.post('/api/orders', {
            userEmail: userDetail?.email,
            name,
            phone,
            zip,
            address,
            totalAmount: parseInt(GetTotal()),
            paymentId,
            paymentMethod
        })
    }

    const handleCOD = async () => {
        setLoading(true)
        try {
            await saveOrder('COD')
            setCart([])
            router.push('/order-success')
        } catch (e) {
            toast.error('Something went wrong!')
        } finally {
            setLoading(false)
        }
    }

    const handleRazorpay = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post('/api/orders/razorpay', {
                amount: parseInt(GetTotal())
            })

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: 'INR',
                name: 'Designify',
                description: 'Order Payment',
                order_id: data.id,
                handler: async (response: any) => {
                    await saveOrder(response.razorpay_payment_id)
                    setCart([])
                    router.push('/order-success')
                },
                prefill: {
                    name: name,
                    email: userDetail?.email,
                    contact: phone
                },
                theme: {
                    color: '#7c3aed'
                }
            }

            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => {
                //@ts-ignore
                const rzp = new window.Razorpay(options)
                rzp.open()
            }
            document.body.appendChild(script)

        } catch (e) {
            toast.error('Payment failed!')
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async () => {
        if (!name || !email || !phone || !zip || !address) {
            toast.error('Please fill all fields')
            return
        }

        if (paymentMethod === 'cod') {
            await handleCOD()
        } else {
            await handleRazorpay()
        }
    }

    return (
        <div className=''>
            <h2 className='p-3 mt-3 rounded-xl bg-primary text-lg md:text-xl font-bold text-center text-white'>Checkout</h2>
            <div className='p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>

                {/* ✅ Billing Details - one field per line */}
                <div className='md:col-span-2 w-full md:order-1'>
                    <h2 className='font-bold text-2xl md:text-3xl mb-4'>Billing Details</h2>
                    <div className='flex flex-col gap-4 mt-4'>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder='Phone'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Input
                            placeholder='Zip'
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                        <Input
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {/* ✅ Total Cart + Payment Method + Button */}
                <div className='w-full border rounded-lg shadow-sm h-fit md:order-2'>
                    <h2 className='p-3 bg-gray-200 font-bold text-center rounded-t-lg'>
                        Total Cart ({cart?.length ?? 0})
                    </h2>
                    <div className='p-4 flex flex-col gap-4'>
                        <h2 className='font-bold flex justify-between'>
                            Subtotal : <span>₹{GetSubtotal()}.00</span>
                        </h2>
                        <hr />
                        <h2 className='flex justify-between'>
                            Delivery : <span>₹{GetDelivery()}.00</span>
                        </h2>
                        <hr />
                        <h2 className='font-bold flex justify-between text-lg'>
                            Total : <span>₹{GetTotal()}</span>
                        </h2>
                        <hr />

                        {/* ✅ Payment Method inside Total Cart */}
                        <div className='flex flex-col gap-3'>
                            <h3 className='font-semibold text-sm'>Payment Method</h3>
                            <label className='flex items-center gap-3 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value='cod'
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className='w-4 h-4 accent-primary'
                                />
                                <span className='text-sm'>Cash on Delivery</span>
                            </label>
                            <label className='flex items-center gap-3 cursor-pointer'>
                                <input
                                    type='radio'
                                    name='payment'
                                    value='upi'
                                    checked={paymentMethod === 'upi'}
                                    onChange={() => setPaymentMethod('upi')}
                                    className='w-4 h-4 accent-primary'
                                />
                                <span className='text-sm'>UPI / Online Payment</span>
                            </label>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={loading}
                            className='w-full flex items-center justify-center gap-2 cursor-pointer'
                        >
                            {loading ? 'Processing...' : 'Payment'} <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Checkout