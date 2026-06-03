import React from 'react'
import { Product } from './PopularProducts'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Palette } from 'lucide-react'
import Link from 'next/link'

type Props = {
    product: Product
}

function ProductCard({product}: Props) {
  return (
    <Link href={'/product/' + product?.documentId} className='group bg-white border border-gray-100 rounded-[32px] p-5 sm:p-6 flex flex-col justify-start items-center text-center cursor-pointer shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 h-full block'>
      <div className="w-full h-[160px] sm:h-[220px] flex items-center justify-center bg-gray-50/80 rounded-[24px] mb-5 p-4 group-hover:bg-orange-50/50 transition-colors duration-500">
        {product?.productImage?.[0]?.url ? (
          <Image 
            src={product.productImage[0].url} 
            alt={product.title || 'Product Image'} 
            width={200} 
            height={200}
            className='max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm'
          />
        ) : (
          <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">No Image</span>
          </div>
        )}
      </div>
      <h3 className='font-bold text-sm sm:text-base text-gray-900 line-clamp-2 leading-tight px-2'>{product.title}</h3>
    </Link>
  )
}

export default ProductCard
