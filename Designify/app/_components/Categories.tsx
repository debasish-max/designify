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
    const result = await axios.get('/api/categories');
    setCategoryList(result?.data)
  }

  return (
    <div className="mt-10 px-5">
      <h2 className='font-black text-3xl text-gray-900 tracking-tighter mb-8'>Shop by Category</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {categoryList?.map((category: Category, index: number) => (
          <Link href={'/products?category=' + encodeURIComponent(category?.name)} key={category.id} className='group p-6 bg-white border border-gray-100 rounded-[32px] flex flex-col items-center justify-center gap-5 hover:border-primary hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer'>
            <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              {category?.image?.url && <Image src={category.image.url} width={80} height={80} alt={category.name} className="w-full h-full object-contain" />}
            </div>
            <h2 className='text-sm font-black text-gray-900 uppercase tracking-widest'>{category?.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories
