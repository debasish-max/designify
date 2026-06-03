"use client"
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Category = {
  name: string,
  image: {
    url: string
  },
  id: number,
  slug: string
}
function Categories() {

  const [categoryList, setCategoryList] = useState<Category[]>();

  useEffect(() => {
    GetCategoryList();
  }, [])

  const GetCategoryList = async () => {
    try {
      const result = await axios.get('/api/categories');
      setCategoryList(result?.data)
    } catch (e) {
      console.error('Error fetching categories:', e);
      setCategoryList([]);
    }
  }

  return (
    <section className="bg-white py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black tracking-widest uppercase mb-6 w-fit">
            Browse
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Shop by Category
          </h2>
        </div>

        <div className='flex flex-wrap justify-start gap-4 sm:gap-6'>
          {categoryList?.map((category: Category, index: number) => (
            <Link 
              href={'/products?category=' + encodeURIComponent(category?.name)} 
              key={category.id} 
              className='group w-[140px] sm:w-[160px] h-[160px] sm:h-[180px] p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer'
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-2">
                {category?.image?.url && <Image src={category.image.url} width={80} height={80} alt={category.name} className="w-full h-full object-contain drop-shadow-sm" />}
              </div>
              <h3 className='text-[11px] sm:text-[12px] font-black text-gray-900 uppercase tracking-widest text-center leading-tight'>{category?.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
