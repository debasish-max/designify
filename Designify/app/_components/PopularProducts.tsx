"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import ProductCard from './ProductCard';

export type Product = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  pricing: number;
  isFeatured: boolean;
  isPopular: boolean;
  categoryName: string;
  sizes: string[];
  mockup_2d?: string;
  productImage: Array<{
    url: string;
  }>;
  documentId: string;
}

function PopularProducts() {

  const [productList, setProductList] = useState<Product[]>()

  useEffect(() => {
    GetPopularProducts();
  }, [])

  const GetPopularProducts = async () => {
    // Fetch all products so we actually have items to show, then we'll slice to 4
    const result = await axios.get('/api/products');
    setProductList(result.data);
  }

  return (
    <div className='mt-20 px-5'>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className='font-black text-3xl text-gray-900 tracking-tighter'>Featured Products</h2>
        <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-colors flex items-center gap-2 w-fit">
          View All Products <span className="text-sm leading-none">→</span>
        </Link>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
        {productList?.slice(0, 4).map((product: Product) => (
          <ProductCard product={product} key={product.documentId} />
        ))}
      </div>

      {(!productList || productList.length === 0) && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-[32px] mt-4 border border-dashed border-gray-200">
          <span className="text-xs font-black uppercase tracking-widest">No products found</span>
        </div>
      )}
    </div>
  )
}

export default PopularProducts
