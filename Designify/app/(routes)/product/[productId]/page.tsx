"use client"
import PopularProducts, { Product } from '@/app/_components/PopularProducts';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '@/context/CartContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { toast } from 'react-toastify';
import Footer from '@/app/_components/Footer';

function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState(false);
    const { cart, setCart } = useContext(CartContext);
    const { userDetail } = useContext(UserDetailContext)
    const [designUrl, setDesignUrl] = useState<string>();
    const router = useRouter()
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');

    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        productId && GetProductById();
    }, [productId])

    const GetProductById = async () => {
        setLoading(true);
        const result = await axios.get('/api/products?productId=' + productId);
        setProduct(result.data);
        setLoading(false);
    }

    const nextThumbnails = () => {
        if (product?.productImage && startIndex + 4 < product.productImage.length) {
            setStartIndex(prev => prev + 1);
        }
    }

    const prevThumbnails = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    }

    const AddToCart = async () => {
        if (!userDetail?.email) {
            toast.error('Please Sign In to add to cart')
            return
        }

        setCart((prev: any) => [
            ...(Array.isArray(prev) ? prev : []),
            {
                design: designUrl,
                products: [product],
                userEmail: userDetail?.email
            }
        ])

        await axios.post('/api/cart', {
            product: product,
            designUrl: designUrl,
            userEmail: userDetail?.email
        })

        toast.success('Added to cart! 🛒', {
            position: 'top-right',
            autoClose: 2000,
        })
    }

    const BuyNow = async () => {
        if (!userDetail?.email) {
            toast.error('Please Sign In to continue')
            return
        }
        await AddToCart()
        router.push('/checkout')
    }

    return (
        <div className='p-5 md:p-10 lg:px-20'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-10'>
                {/* Product Images */}
                <div className='flex gap-5'>
                    <div className='flex flex-col items-center gap-2'>
                        {/* Up Arrow */}
                        {product?.productImage && product.productImage.length > 4 && startIndex > 0 && (
                            <Button variant="ghost" size="icon" onClick={prevThumbnails} className="h-8 w-8">
                                <ChevronUp size={20} />
                            </Button>
                        )}
                        
                        <div className='flex flex-col gap-3'>
                            {product?.productImage?.slice(startIndex, startIndex + 4).map((img:any, index_offset:number) => {
                               const actualIndex = startIndex + index_offset;
                               return (
                               <div key={actualIndex} 
                               onClick={()=>setSelectedImageIndex(actualIndex)}
                               className={`w-20 h-20 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedImageIndex==actualIndex?'border-primary shadow-md':'border-gray-100 hover:border-gray-300'}`}>
                                    <Image src={img.url} alt={product.title} width={80} height={80} className='w-full h-full object-cover' />
                               </div>
                            )})}
                        </div>

                        {/* Down Arrow */}
                        {product?.productImage && product.productImage.length > 4 && startIndex + 4 < product.productImage.length && (
                            <Button variant="ghost" size="icon" onClick={nextThumbnails} className="h-8 w-8">
                                <ChevronDown size={20} />
                            </Button>
                        )}
                    </div>
                    <div className='flex-1 border border-gray-100 rounded-[32px] flex items-center justify-center bg-white min-h-[450px] relative overflow-hidden group shadow-sm'>
                        {product ?
                            <div className="w-full h-full flex items-center justify-center">
                                {product?.productImage?.[selectedImageIndex]?.url ? (
                                    <Image src={product.productImage[selectedImageIndex].url}
                                        alt={product.title || 'Product Image'} width={600} height={600} 
                                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'/> 
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground w-full h-full bg-muted/20">
                                        <span className="text-sm">No Image Available</span>
                                    </div>
                                )}
                            </div>
                            : <Skeleton className='w-full h-[400px] rounded-[32px]' />
                        }
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {product ? <div className='flex flex-col gap-3'>
                        <h2 className='font-bold text-3xl'>{product?.title}</h2>
                        <h2 className='font-bold text-3xl'>₹{product?.pricing}</h2>
                        <p className='text-gray-500 text-lg'>{product?.description}</p>
                        
                        {product?.sizes && product.sizes.length > 0 && (
                            <div className="flex flex-col gap-3 my-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size: string) => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 ${selectedSize === size ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button size={'lg'} onClick={() => router.push(`/product/${productId}/customize${selectedSize ? `?size=${selectedSize}` : ''}`)}>
                                Customize
                        </Button>
                        {/* ✅ Buy Now button */}
                        <Button size={'lg'} onClick={BuyNow}>
                            Buy Now
                        </Button>
                        <Button size={'lg'} onClick={() => AddToCart()}
                            variant={'outline'}>
                            Add To Cart
                        </Button>
                    </div>
                        : <div className='space-y-3'>
                            <Skeleton className='w-full h-[20px]' />
                            <Skeleton className='w-full h-[30px]' />
                            <Skeleton className='w-full h-[50px]' />
                            <Skeleton className='w-full h-[50px]' />
                        </div>}
                </div>
            </div>

            <div className='mt-10 mb-20'>
                <h2 className='font-bold text-lg'>Product Description</h2>
                <p className='text-gray-500 leading-relaxed'>{product?.description}</p>
            </div>

            <PopularProducts />
            <Footer/>
        </div>
    )
}

export default ProductDetail 
