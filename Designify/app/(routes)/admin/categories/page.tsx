"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2, Folder, Loader2, X, Search, MoreHorizontal, Layers, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'

function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
    const router = useRouter()

    useEffect(() => {
        GetCategories()
    }, [])

    const GetCategories = async () => {
        try {
            const result = await axios.get('/api/categories')
            setCategories(result.data)
        } catch (e) {
            toast.error("Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    const onImageUpload = async (e: any) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', file.name)
            const result = await axios.post('/api/imagekit', formData)
            setCurrentCategory((prev: any) => ({ ...prev, image: { url: result.data.url } }))
            toast.success("Icon uploaded!")
        } catch (e) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: any) => {
        e.preventDefault()
        try {
            if (currentCategory.id) {
                await axios.put('/api/categories', currentCategory)
                toast.success("Category updated!")
            } else {
                await axios.post('/api/categories', currentCategory)
                toast.success("Category created!")
            }
            setIsModalOpen(false)
            GetCategories()
        } catch (e) {
            toast.error("Operation failed")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? All products in this category will lose their reference.")) return
        try {
            await axios.delete('/api/categories', { data: { id } })
            toast.success("Category deleted")
            GetCategories()
        } catch (e) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Taxonomy Control</h2>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter text-3xl">Manage Categories</h1>
                </div>
                <Button onClick={() => { setCurrentCategory({ name: '', slug: '', image: { url: '' }, hasFrontAndBack: false }); setIsModalOpen(true); }} className="flex gap-2 bg-primary text-white px-8 py-7 rounded-[22px] shadow-xl shadow-primary/20 text-md font-black">
                    <Plus size={20} className="stroke-[3]" /> Add Category
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                {loading ? (
                    <div className="col-span-full py-32 text-center text-gray-300">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">Syncing Categories...</p>
                    </div>
                ) : categories.length > 0 ? categories.map((cat: any) => (
                    <div key={cat.id} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-primary/5 transition-all relative">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner group-hover:scale-105 transition-transform">
                            {cat.image?.url ? <Image src={cat.image.url} alt={cat.name} fill className="object-contain p-3" /> : <Layers className="text-gray-200" size={32} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-gray-900 text-lg leading-none mb-1 truncate">{cat.name}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-3">Slug: {cat.slug}</p>
                            <div className="flex gap-2">
                                <button onClick={() => { setCurrentCategory(cat); setIsModalOpen(true); }} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary rounded-xl transition shadow-sm"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition shadow-sm"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownId(activeDropdownId === cat.id ? null : cat.id);
                                }}
                                className="p-2 hover:bg-gray-50 rounded-xl transition text-gray-300 hover:text-primary"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {activeDropdownId === cat.id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => {
                                                router.push(`/admin/products?category=${cat.name}`);
                                                setActiveDropdownId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
                                        >
                                            <ExternalLink size={14} /> View products
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentCategory(cat);
                                                setIsModalOpen(true);
                                                setActiveDropdownId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
                                        >
                                            <Pencil size={14} /> Edit Taxonomy
                                        </button>
                                        <div className="h-px bg-gray-50 my-1"></div>
                                        <button
                                            onClick={() => {
                                                handleDelete(cat.id);
                                                setActiveDropdownId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Delete Permanent
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center text-gray-400 font-bold uppercase tracking-widest opacity-20">No categories found</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] w-full max-w-xl p-10 relative shadow-2xl border border-gray-100">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 rounded-full transition"><X size={24} /></button>
                        <div className="mb-8">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 leading-none">Taxonomy Wizard</h2>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{currentCategory?.id ? 'Edit Category' : 'New Category'}</h2>
                        </div>
                        <form onSubmit={handleSave} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                                <Input required className="rounded-2xl py-6 font-bold bg-gray-50 border-gray-100 focus:bg-white transition-all shadow-inner" value={currentCategory?.name} onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} placeholder="e.g. Graphic Tees" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                                <Input required className="rounded-2xl py-6 font-bold bg-gray-50 border-gray-100 focus:bg-white transition-all opacity-70" value={currentCategory?.slug} readOnly placeholder="auto-generated-slug" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Visual Icon</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-primary transition-colors">
                                        {currentCategory?.image?.url ? <Image src={currentCategory.image.url} alt="Preview" fill className="object-contain p-2" /> : <Folder className="text-gray-200" size={32} />}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onImageUpload} disabled={uploading} />
                                        {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={20} /></div>}
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed max-w-[160px]">Click to upload icon. Recommended: 200x200 PNG with transparency.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">Has Front & Back Sides</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Requires both design uploads</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={currentCategory?.hasFrontAndBack || false} onChange={e => setCurrentCategory({ ...currentCategory, hasFrontAndBack: e.target.checked })} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <Button type="submit" className="w-full py-7 rounded-[22px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition active:translate-y-0 mt-4">
                                {currentCategory?.id ? 'Update Taxonomy' : 'Confirm Category'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCategories
