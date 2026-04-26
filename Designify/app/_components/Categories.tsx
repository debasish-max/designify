"use client"
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Category = {
    name: string,
    icon: {
        url: string
    },
    documentId: string,
    id: number,
    slug: string
}
function Categories() {

    const [categoryList, setCategoryList] = useState<Category[]>();
    
    useEffect(() => {
        GetCategoryList();
    },[])

   const GetCategoryList = async () => {
        const result = await axios.get('/api/categories');
        setCategoryList(result?.data)
   } 

  return (
    <div>
      <h2 className='font-bold text-2xl'>Popular Categories</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 '>
        {categoryList?.map((category:Category, index:number) => (
            <Link href={'/category/' + category?.slug} key={category.documentId} className='p-4 border rounded-lg flex flex-col items-center hover:bg-fuchsia-100 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300'>
                <Image src={category?.icon?.url} width={80} height={80} alt={category.name}/>
                <h2 className='text-lg font-medium'>{category?.name}</h2>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories
