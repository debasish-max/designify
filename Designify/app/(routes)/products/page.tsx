"use client"
import Footer from '@/app/_components/Footer';
import { Product } from '@/app/_components/PopularProducts';
import ProductCard from '@/app/_components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryQuery])

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      if (searchQuery) {
        url = `/api/products?search=${encodeURIComponent(searchQuery)}`;
      } else if (categoryQuery) {
        url = `/api/products?category=${encodeURIComponent(categoryQuery)}`;
      }
      const result = await axios.get(url);
      setProductList(result.data || []);
    } catch (e) {
      console.error('Error fetching products:', e);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='my-20'>
      <div className='flex items-center justify-between mb-8 px-5'>
        <div>
          <h1 className='font-bold text-5xl'>
            {searchQuery ? 'Search Results' : categoryQuery ? `${categoryQuery}` : 'All Products'}
          </h1>
          <p className='text-lg text-muted-foreground mt-2'>
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : categoryQuery ? `Browse our premium ${categoryQuery} collection` : 'Browse our complete collection'}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-5'>
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="p-5 border rounded-xl flex flex-col items-center gap-4">
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))
        ) : productList.length > 0 ? (
          productList.map((product: Product) => (
            <ProductCard product={product} key={product.documentId} />
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-20 text-center'>
            <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4'>
              <Search className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='font-semibold text-xl mb-1'>No products found</h3>
            <p className='text-muted-foreground'>
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
                : categoryQuery ? `No products available in the ${categoryQuery} category at the moment.` : 'No products are available at the moment.'}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className='my-20'>
        <Skeleton className="h-12 w-[300px] mb-4" />
        <Skeleton className="h-6 w-[200px] mb-7" />
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-5 border rounded-xl flex flex-col items-center gap-4">
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}
