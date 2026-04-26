"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, X, Search, Filter, MoreHorizontal, ArrowUpDown, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        GetProducts()
        GetCategories()
    }, [])

    useEffect(() => {
        const cat = searchParams.get('category')
        if (cat) setSelectedCategory(cat)
    }, [searchParams])

    const GetCategories = async () => {
        try {
            const result = await axios.get('/api/categories')
            setCategories(result.data)
        } catch (e) {
            console.error("Categories fetch error")
        }
    }

    const GetProducts = async () => {
        try {
            const result = await axios.get('/api/products')
            setProducts(result.data)
        } catch (e) {
            toast.error("Failed to load products")
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
            const imageUrl = result.data.url

            setCurrentProduct((prev: any) => ({
                ...prev,
                productImage: [...(prev?.productImage || []), { url: imageUrl }]
            }))
            toast.success("Image uploaded!")
        } catch (e) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: any) => {
        e.preventDefault()
        const selectedCatObj = categories.find((c: any) => c.name === currentProduct?.categoryName)
        const hasFrontAndBack = selectedCatObj?.hasFrontAndBack || false
        
        if (!currentProduct.mockup2dFront) {
            toast.error("Front Design is compulsory.")
            return
        }
        if (hasFrontAndBack && !currentProduct.mockup2dBack) {
            toast.error("Back Design is compulsory for this category.")
            return
        }

        try {
            if (currentProduct.id) {
                await axios.put('/api/products', currentProduct)
                toast.success("Product updated!")
            } else {
                await axios.post('/api/products', currentProduct)
                toast.success("Product created!")
            }
            setIsModalOpen(false)
            GetProducts()
        } catch (e) {
            toast.error("Operation failed")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return
        try {
            await axios.delete('/api/products', { data: { id } })
            toast.success("Product deleted")
            GetProducts()
        } catch (e) {
            toast.error("Failed to delete")
        }
    }

    const filteredProducts = products.filter((p: any) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !selectedCategory || p.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a: any, b: any) => {
        if (sortBy === 'price-high') return b.pricing - a.pricing;
        if (sortBy === 'price-low') return a.pricing - b.pricing;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        return (b as any).id - (a as any).id;
    });

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">Inventory Control</h2>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Product Catalog</h1>
                </div>
                <Button 
                    onClick={() => { setCurrentProduct({ title: '', pricing: 0, categoryName: '', productImage: [], sizes: [], mockup2dFront: '', mockup2dBack: '' }); setIsModalOpen(true); }} 
                    className="flex gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-7 rounded-[22px] shadow-xl shadow-primary/20 text-md font-black transition-all hover:-translate-y-1 active:scale-95"
                >
                    <Plus size={20} className="stroke-[3]" /> Add New Item
                </Button>
            </header>

            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 w-full md:w-96 group focus-within:bg-white transition-all focus-within:ring-4 ring-primary/5">
                    <Search size={18} className="text-gray-400 group-focus-within:text-primary transition" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or category..." 
                        className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-gray-400" 
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto relative">
                    {/* Category Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-5 py-3 border rounded-2xl text-sm font-bold transition shadow-sm ${
                                selectedCategory ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={18} /> {selectedCategory || 'Categories'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-30 animate-in fade-in zoom-in-95 duration-200">
                                    <button 
                                        onClick={() => { setSelectedCategory(''); setIsFilterOpen(false); }}
                                        className="w-full text-left px-5 py-2 text-xs font-bold text-gray-400 hover:bg-gray-50 uppercase tracking-widest"
                                    >
                                        Show All
                                    </button>
                                    <div className="h-px bg-gray-50 my-2"></div>
                                    <div className="max-h-60 overflow-y-auto px-2">
                                        {categories.map((cat: any) => (
                                            <button 
                                                key={cat.id}
                                                onClick={() => { setSelectedCategory(cat.name); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors mb-1 ${
                                                    selectedCategory === cat.name ? 'bg-primary text-white' : 'hover:bg-primary/5 text-gray-600'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
                        >
                            <ArrowUpDown size={18} /> Sort
                        </button>
                        {isSortOpen && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsSortOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
                                    {[
                                        { label: 'Newest First', value: 'newest' },
                                        { label: 'Price: High to Low', value: 'price-high' },
                                        { label: 'Price: Low to High', value: 'price-low' },
                                        { label: 'Name: A-Z', value: 'title-asc' },
                                        { label: 'Name: Z-A', value: 'title-desc' },
                                    ].map((opt) => (
                                        <button 
                                            key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                                                sortBy === opt.value ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-w-[900px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FAFBFE] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6 border-b border-gray-50">Visual</th>
                                <th className="px-10 py-6 border-b border-gray-50">Product Name</th>
                                <th className="px-10 py-6 border-b border-gray-50">Category</th>
                                <th className="px-10 py-6 border-b border-gray-50">Price</th>
                                <th className="px-10 py-6 border-b border-gray-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-gray-300">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 opacity-20" />
                                        <p className="font-black uppercase tracking-widest text-xs">Syncing Catalog...</p>
                                    </td>
                                </tr>
                             ) : filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                                <tr key={product.id} className="group hover:bg-primary/5 transition-colors cursor-pointer">
                                    <td className="px-10 py-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            {product.productImage?.[0]?.url ? (
                                                <Image src={product.productImage[0].url} alt={product.title} fill className="object-contain p-2" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-lg tracking-tight group-hover:text-primary transition-colors">{product.title}</span>
                                            <span className="text-xs text-gray-400 font-bold tracking-tight">ID: #{product.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {product.categoryName}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="font-black text-gray-900 text-xl tracking-tighter">₹{product.pricing.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-3 relative">
                                            <button 
                                                onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }} 
                                                className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition duration-300 active:scale-90"
                                            >
                                                <Pencil size={18} className="stroke-[2.5]" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)} 
                                                className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition duration-300 active:scale-90"
                                            >
                                                <Trash2 size={18} className="stroke-[2.5]" />
                                            </button>
                                            
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdownId(activeDropdownId === product.id ? null : product.id);
                                                    }}
                                                    className={`p-3 rounded-xl transition duration-300 ${activeDropdownId === product.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                
                                                {activeDropdownId === product.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)}></div>
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 text-left">
                                                            <button 
                                                                onClick={() => { setCurrentProduct(product); setIsModalOpen(true); setActiveDropdownId(null); }}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
                                                            >
                                                                <Pencil size={14} /> Quick Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => { /* View on store logic */ setActiveDropdownId(null); }}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary flex items-center gap-2"
                                                            >
                                                                <ExternalLink size={14} /> View in Store
                                                            </button>
                                                            <div className="h-px bg-gray-50 my-1"></div>
                                                            <button 
                                                                onClick={() => { handleDelete(product.id); setActiveDropdownId(null); }}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={14} /> Delete Product
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center text-gray-400 font-bold uppercase tracking-widest italic opacity-20">No products in inventory</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 relative shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
                        
                        <div className="mb-10">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 leading-none">Catalog Wizard</h2>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{currentProduct?.id ? 'Edit Product Details' : 'Onboard New Product'}</h2>
                        </div>
                        
                        <form onSubmit={handleSave} className="flex flex-col gap-8">
                            {(() => {
                                const selectedCatObj = categories.find((c: any) => c.name === currentProduct?.categoryName);
                                const hasFrontAndBack = selectedCatObj?.hasFrontAndBack || false;
                                return (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Display Title</label>
                                    <Input required className="rounded-2xl py-6 font-bold bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 ring-primary/5 transition-all" value={currentProduct?.title} onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} placeholder="e.g. Minimalist Summer Tee" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Pricing (INR)</label>
                                    <Input required type="number" className="rounded-2xl py-6 font-bold bg-gray-50 border-gray-100 focus:bg-white transition-all shadow-inner" value={currentProduct?.pricing} onChange={e => setCurrentProduct({...currentProduct, pricing: parseInt(e.target.value)})} placeholder="0.00" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Classification</label>
                                    <select 
                                        required 
                                        className="w-full rounded-2xl py-5 px-5 font-bold bg-gray-50 border-none outline-none focus:bg-white focus:ring-4 ring-primary/5 transition-all text-sm h-[60px]" 
                                        value={currentProduct?.categoryName} 
                                        onChange={e => setCurrentProduct({...currentProduct, categoryName: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Marketability</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={currentProduct?.isPopular} onChange={e => setCurrentProduct({...currentProduct, isPopular: e.target.checked})} className="sr-only peer" />
                                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">Featured in Home Trend</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sizes and Mockup Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Available Sizes</label>
                                    <div className="flex flex-col gap-2">
                                        <Input 
                                            className="rounded-2xl py-6 font-bold bg-gray-50 border-gray-100 focus:bg-white transition-all shadow-inner" 
                                            value={currentProduct?.sizes?.join(', ')} 
                                            onChange={e => setCurrentProduct({...currentProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                                            placeholder="e.g. S, M, L, XL (Comma separated)" 
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                type="button"
                                                onClick={() => setCurrentProduct({...currentProduct, sizes: ['S', 'M', 'L', 'XL', 'XXL']})}
                                                className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full hover:bg-primary/10 transition"
                                            >
                                                Default Tee
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setCurrentProduct({...currentProduct, sizes: ['A4', 'A3', 'A2', 'A1']})}
                                                className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full hover:bg-primary/10 transition"
                                            >
                                                Default Poster
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Item Narrative</label>
                                <textarea className="w-full rounded-[20px] border border-gray-100 bg-gray-50 p-5 text-sm font-bold outline-none focus:bg-white focus:border-primary focus:ring-4 ring-primary/5 transition-all h-36 placeholder:text-gray-300 shadow-inner" value={currentProduct?.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} placeholder="Tell the story of this product..." />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Media Assets</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {currentProduct?.productImage?.map((img: any, i: number) => (
                                        <div key={i} className="relative group aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-inner translate-z-0">
                                            <Image src={img.url} alt="Product" fill className="object-contain p-2" />
                                            <button type="button" onClick={() => setCurrentProduct({...currentProduct, productImage: currentProduct.productImage.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg translate-y-2 group-hover:translate-y-0"><X size={14} className="stroke-[3]" /></button>
                                        </div>
                                    ))}
                                    <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 text-gray-300 hover:text-primary group">
                                        {uploading ? <Loader2 className="animate-spin text-primary" /> : <Plus className="group-hover:scale-125 transition-transform" size={28} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">Add Media</span>
                                        <input type="file" className="hidden" onChange={onImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Designs (Compulsory)</label>
                                <div className="flex gap-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Front Design</span>
                                        <div className="flex items-center gap-4 h-[100px]">
                                            {currentProduct?.mockup2dFront ? (
                                                <div className="relative w-24 h-24 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shadow-sm">
                                                    <Image src={currentProduct.mockup2dFront} alt="Front Design" fill className="object-contain p-1" />
                                                    <button type="button" onClick={() => setCurrentProduct({...currentProduct, mockup2dFront: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><X size={12} /></button>
                                                </div>
                                            ) : (
                                                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                                    {uploading ? <Loader2 className="animate-spin text-primary w-5 h-5" /> : <Plus size={20} className="text-gray-300 group-hover:text-primary mb-1" />}
                                                    <span className="text-[9px] font-black uppercase text-gray-400">Upload</span>
                                                    <input type="file" className="hidden" onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        setUploading(true);
                                                        try {
                                                            const formData = new FormData(); formData.append('file', file); formData.append('fileName', file.name);
                                                            const result = await axios.post('/api/imagekit', formData);
                                                            setCurrentProduct({...currentProduct, mockup2dFront: result.data.url});
                                                        } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
                                                    }} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {hasFrontAndBack && (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Back Design</span>
                                            <div className="flex items-center gap-4 h-[100px]">
                                                {currentProduct?.mockup2dBack ? (
                                                    <div className="relative w-24 h-24 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shadow-sm">
                                                        <Image src={currentProduct.mockup2dBack} alt="Back Design" fill className="object-contain p-1" />
                                                        <button type="button" onClick={() => setCurrentProduct({...currentProduct, mockup2dBack: ''})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><X size={12} /></button>
                                                    </div>
                                                ) : (
                                                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                                        {uploading ? <Loader2 className="animate-spin text-primary w-5 h-5" /> : <Plus size={20} className="text-gray-300 group-hover:text-primary mb-1" />}
                                                        <span className="text-[9px] font-black uppercase text-gray-400">Upload</span>
                                                        <input type="file" className="hidden" onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setUploading(true);
                                                            try {
                                                                const formData = new FormData(); formData.append('file', file); formData.append('fileName', file.name);
                                                                const result = await axios.post('/api/imagekit', formData);
                                                                setCurrentProduct({...currentProduct, mockup2dBack: result.data.url});
                                                            } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
                                                        }} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <Button type="submit" className="flex-1 py-7 rounded-[22px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition active:translate-y-0">
                                    {currentProduct?.id ? 'Confirm Updates' : 'Launch Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="px-10 py-7 rounded-[22px] border-gray-200 text-gray-400 font-bold hover:bg-gray-50 transition">
                                    Discard
                                </Button>
                            </div>
                                    </>
                                );
                            })()}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts
