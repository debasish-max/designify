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
    try {
      // Fetch all products so we actually have items to show, then we'll slice to 4
      const result = await axios.get('/api/products');
      setProductList(result.data);
    } catch (e) {
      console.error('Error fetching popular products:', e);
      setProductList([]);
    }
  }

  return (
    <section className="bg-gray-50/40 border-t border-gray-100 py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-black tracking-widest uppercase mb-6 w-fit">
              Bestsellers
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Featured Products
            </h2>
          </div>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group w-fit">
            View All Products 
            <span className="text-sm leading-none group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {productList?.slice(0, 4).map((product: Product) => (
            <ProductCard product={product} key={product.documentId} />
          ))}
        </div>

        {(!productList || productList.length === 0) && (
          <div className="w-full py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[32px] mt-4 border border-dashed border-gray-200">
            <span className="text-sm font-black uppercase tracking-widest">No products found</span>
          </div>
        )}
      </div>
    </section>
  )
}

export default PopularProducts
