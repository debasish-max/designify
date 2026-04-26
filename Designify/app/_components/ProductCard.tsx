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
    <div className='border rounded-xl p-2 sm:p-4 flex flex-col justify-between items-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full'>
      <div className="w-full h-[120px] sm:h-[180px] flex items-center justify-center">
        {product?.productImage?.[0]?.url ? (
          <Image 
            src={product.productImage[0].url} 
            alt={product.title || 'Product Image'} 
            width={150} 
            height={150}
            className='max-h-full w-auto object-contain'
          />
        ) : (
          <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] bg-muted flex flex-col items-center justify-center rounded-lg border border-dashed">
            <span className="text-xs text-muted-foreground mt-2">No Image</span>
          </div>
        )}
      </div>
      <h2 className='font-medium text-xs sm:text-base mt-2 line-clamp-2 min-h-[32px] sm:min-h-[48px]'>{product.title}</h2>
      <Link href={'/product/' + product?.documentId} className='w-full'>
          <Button className='w-full mt-2 text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1 sm:gap-2'> <Palette size={14} className='sm:w-[18px] sm:h-[18px]' /> Customize</Button>
      </Link>
    </div>
  )
}

export default ProductCard
