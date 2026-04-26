'use client'
import { Product } from '@/app/_components/PopularProducts'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { GalleryVerticalEnd, ImageOff, ImageUpscale, Upload } from 'lucide-react'
import { Canvas, FabricImage } from 'fabric'
import axios from 'axios'

type Props = {
    product: Product,
    setDesignUrl: any
}

const DEFAULT_IMAGE='https://ik.imagekit.io/designify911/Woody_Small_e778b96593_9muYzkrnA.jpg'
const AITransformOptions = [
    {
        name:'BG Remove',
        icon:ImageOff,
        imageKitTr:'e-bgremove'
    },
    {
        name:'Upscale',
        icon:ImageUpscale,
        imageKitTr:'e-upscale'
    },
    {
        name:'Shadow',
        icon:GalleryVerticalEnd,
        imageKitTr:'e-shadow'
    }
]
function ProductCustomizeStudio({product, setDesignUrl}: Props) {

    const canvasRef = useRef<any>(null);
    const [canvasInstance, setCanvasInstance] =useState<any>(null);
    const [uploadedImage,setUploadedImage]=useState<string>(DEFAULT_IMAGE)

    useEffect(() => {
        if(canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width:170,
                height:170,
                backgroundColor:'transparent', 
            });
            initCanvas.renderAll();
            setCanvasInstance(initCanvas);

            return () => {
                initCanvas.dispose();
            }
        }
    }, [])

    useEffect(() => {
        if(canvasInstance) {
            AddDefaultImageToCanvas();
            setDesignUrl(uploadedImage);
        }
    }, [canvasInstance,uploadedImage])

    const AddDefaultImageToCanvas = async ()=>{
        canvasInstance.clear();
        canvasInstance.renderAll();
        const canvasImageRef=await FabricImage.fromURL(uploadedImage);
        canvasImageRef.scaleX=0.1;
        canvasImageRef.scaleY=0.1;
        canvasInstance.add(canvasImageRef);
        canvasInstance.renderAll();
    }

    const onHandleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const result = await axios.post('/api/imagekit', formData);
        const uploadedImageUrl = result.data.url;

        if (uploadedImageUrl) {
            setUploadedImage(uploadedImageUrl);
            canvasInstance.clear();
            const canvasImageRef = await FabricImage.fromURL(uploadedImageUrl);
            canvasImageRef.scaleX = 0.1;
            canvasImageRef.scaleY = 0.1;
            canvasInstance.add(canvasImageRef);
            canvasInstance.renderAll();
        }
    }
}

const OnApplyAITransformation=(transformation:any,add:boolean)=>{

    if(add) {
        if(uploadedImage?.includes('?tr=')) {
            const newUrl=uploadedImage+transformation+','
            setUploadedImage(newUrl);
        } else{
            const newUrl = uploadedImage+'?tr='+transformation+','
            setUploadedImage(newUrl);
        }
    }

    else{
        const newUrl = uploadedImage.replace(transformation,'');
        setUploadedImage(newUrl);
    }
    
}
    
    const isTransformationApplied=(transformation:string)=>{
        return uploadedImage?.includes(transformation) ? false : true;
    }


  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center h-[400px] w-[400px]'>
        <canvas
                id='canvas'
                ref={canvasRef}
                className='absolute top-25 left-0.5 z-10 rounded-xl'
        />
        <Image src={product?.productImage[0]?.url} alt={product?.title} width={400} height={400}/>
      </div>
      <div className='flex gap-5 my-5'>
        <label htmlFor='uploadImage'>
        <div className='flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-100'>
            <Upload/>
            <h2>Upload Image</h2>
        </div>
        </label>
        <input type='file' id='uploadImage' className='hidden'onChange={onHandleImageUpload}/>
       
       {AITransformOptions.map((item)=>( 
        <div key = {item.name} className = {`flex flex-col p-5 items-center border rounded-lg hover:border-primary cursor-pointer hover:bg-fuchsia-100
             ${uploadedImage.includes(item.imageKitTr)?'border-primary':null}
        `}

        onClick={()=>OnApplyAITransformation(item?.imageKitTr,isTransformationApplied(item.imageKitTr))}
         >
            <item.icon/> 
             <h2 className = 'text-center'>{item.name}</h2>   
            </div>
       ))}
       
    
      </div>
    </div>
  )
}
export default ProductCustomizeStudio
