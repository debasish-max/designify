"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { 
  ArrowLeft, Info, RotateCcw, RotateCw, 
  Upload, Type, ImageOff, GalleryVerticalEnd, 
  AlignCenter, FlipHorizontal, Trash2, 
  Save, X, Loader2, Palette, Undo2, Redo2, 
  Layers, Copy, MoveUp, MoveDown, Maximize, 
  ChevronDown, ChevronUp, Ratio, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Canvas, FabricImage, IText, FabricObject } from 'fabric'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { Product } from '@/app/_components/PopularProducts'
import { useSearchParams } from 'next/navigation'


export default function CustomizePage() {
    const { productId } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'ai'>('upload');
    const [canvasLayers, setCanvasLayers] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [variantStartIndex, setVariantStartIndex] = useState(0);
    const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
    const [category, setCategory] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Fetch Product Data
    useEffect(() => {
        if (productId) {
            GetProductById();
        }
    }, [productId])

    const GetProductById = async () => {
        try {
            const result = await axios.get('/api/products?productId=' + productId);
            setProduct(result.data);
            
            if (result.data.categoryName) {
                const catResult = await axios.get('/api/categories');
                const cat = catResult.data.find((c: any) => c.name === result.data.categoryName);
                if (cat) setCategory(cat);
            }

            setLoading(false);
        } catch (e) {
            toast.error("Failed to load product");
            router.push('/');
        }
    }

    // Initialize & Resize Canvas
    useEffect(() => {
        if (!loading && canvasRef.current && product) {
            const activePrintArea = currentSide === 'front' 
                ? (product.printAreaFront || { x: 0, y: 0, width: 100, height: 100 })
                : (product.printAreaBack || { x: 0, y: 0, width: 100, height: 100 });

            // Calculate pixel dimensions based on the 500x500 parent container
            const canvasWidth = (activePrintArea.width / 100) * 500;
            const canvasHeight = (activePrintArea.height / 100) * 500;

            if (!canvas) {
                const initCanvas = new Canvas(canvasRef.current, {
                    width: canvasWidth,
                    height: canvasHeight,
                    backgroundColor: 'transparent',
                });
                
                initCanvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
                initCanvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
                initCanvas.on('selection:cleared', () => setSelectedObject(null));
                
                initCanvas.on('object:added', () => updateLayers(initCanvas));
                initCanvas.on('object:removed', () => updateLayers(initCanvas));
                initCanvas.on('object:modified', () => {
                    updateLayers(initCanvas);
                    saveToHistory(initCanvas);
                });

                setCanvas(initCanvas);
                saveToHistory(initCanvas);
            } else {
                canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
                canvas.renderAll();
            }
        }
    }, [loading, product, currentSide]);

    const updateLayers = (c: Canvas) => {
        const objects = c.getObjects().map((obj, i) => ({
            id: i,
            type: obj.type,
            name: (obj as any).text || `Layer ${i + 1}`,
            object: obj
        })).reverse();
        setCanvasLayers(objects);
    };

    const saveToHistory = (c: Canvas) => {
        const json = JSON.stringify(c.toJSON());
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, json];
        });
        setHistoryIndex(prev => prev + 1);
        
        // Update live preview
        try {
            setPreviewUrl(c.toDataURL({ format: 'png', multiplier: 2 }));
        } catch (e) {
            console.error("Failed to generate preview", e);
        }
    };

    // Tool Handlers
    const addText = (preset: 'headline' | 'subheading' | 'standard' = 'standard') => {
        if (!canvas) return;
        
        let settings = {
            left: 200,
            top: 200,
            fontFamily: 'arial',
            fontSize: 30,
            fontWeight: 'normal',
            fill: '#000000',
            text: 'Add your text'
        };

        if (preset === 'headline') {
            settings = { ...settings, fontSize: 50, fontWeight: 'bold', text: 'HEADLINE TEXT' };
        } else if (preset === 'subheading') {
            settings = { ...settings, fontSize: 35, fontStyle: 'italic', text: 'Subheading text' } as any;
        }

        const text = new IText(settings.text, settings);
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const handleSave = () => {
        toast.info("Saving your design...", { autoClose: 1000 });
        setTimeout(() => {
            toast.success("Design Saved to Gallery! 🎨", {
                position: "bottom-center"
            });
        }, 1500);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !canvas) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);

            const result = await axios.post('/api/imagekit', formData);
            const imageUrl = result.data.url;

            if (imageUrl) {
                const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
                img.scale(0.2); // Initial scale
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            }
        } catch (err) {
            toast.error("Upload failed");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const applyAITransformation = async (transformation: string) => {
        const activeObj = canvas?.getActiveObject();
        if (!activeObj || !(activeObj instanceof FabricImage)) {
            toast.info("Please select an image first");
            return;
        }

        const currentUrl = (activeObj as any)._element.src;
        let newUrl = currentUrl;
        
        if (newUrl.includes('?tr=')) {
            newUrl += `,${transformation}`;
        } else {
            newUrl += `?tr=${transformation}`;
        }

        const newImg = await FabricImage.fromURL(newUrl, { crossOrigin: 'anonymous' });
        newImg.set({
            left: activeObj.left,
            top: activeObj.top,
            scaleX: activeObj.scaleX,
            scaleY: activeObj.scaleY,
            angle: activeObj.angle
        });

        canvas?.remove(activeObj);
        canvas?.add(newImg);
        canvas?.setActiveObject(newImg);
        canvas?.renderAll();
    };

    // Object Controls
    const deleteSelected = () => {
        const activeObjects = canvas?.getActiveObjects();
        if (activeObjects) {
            activeObjects.forEach(obj => canvas?.remove(obj));
            canvas?.discardActiveObject();
            canvas?.renderAll();
        }
    };

    const alignCenter = () => {
        const activeObj = canvas?.getActiveObject();
        if (activeObj) {
            canvas?.centerObject(activeObj);
            canvas?.renderAll();
        }
    };

    const flipObject = () => {
        const activeObj = canvas?.getActiveObject();
        if (activeObj) {
            activeObj.set('flipX', !activeObj.flipX);
            canvas?.renderAll();
        }
    };

    const duplicateObject = () => {
        const activeObj = canvas?.getActiveObject();
        if (activeObj) {
            activeObj.clone().then((cloned: any) => {
                cloned.set({
                    left: activeObj.left! + 10,
                    top: activeObj.top! + 10,
                });
                canvas?.add(cloned);
                canvas?.setActiveObject(cloned);
                canvas?.renderAll();
            });
        }
    };

    const bringForward = () => {
        const activeObj = canvas?.getActiveObject();
        if (activeObj) {
            canvas?.bringObjectForward(activeObj);
            canvas?.renderAll();
            updateLayers(canvas!);
        }
    };

    const sendBackward = () => {
        const activeObj = canvas?.getActiveObject();
        if (activeObj) {
            canvas?.sendObjectBackwards(activeObj);
            canvas?.renderAll();
            updateLayers(canvas!);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            canvas?.loadFromJSON(history[historyIndex - 1]).then(() => {
                canvas.renderAll();
            });
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            canvas?.loadFromJSON(history[historyIndex + 1]).then(() => {
                canvas.renderAll();
            });
        }
    };

    const updateObjectProp = (prop: string, value: number) => {
        if (selectedObject) {
            selectedObject.set(prop as any, value);
            canvas?.renderAll();
            canvas?.requestRenderAll();
        }
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50 uppercase tracking-widest text-xs font-black">
            <Loader2 className="animate-spin mr-3 text-primary" /> Initialized Studio...
        </div>
    );

    return (
        <div className="h-screen w-full flex flex-col bg-[#F9FAFB] overflow-hidden text-[#111827]">
            {/* --- TOP BAR --- */}
            <header className="h-16 px-6 bg-white border-b border-gray-100 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-gray-50">
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="h-4 w-px bg-gray-200 mx-2" />
                    
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="text-gray-400 hover:text-gray-900"><Undo2 size={18} /></Button>
                        <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="text-gray-400 hover:text-gray-900"><Redo2 size={18} /></Button>
                    </div>

                    <div className="h-4 w-px bg-gray-200 mx-2" />
                    
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={alignCenter} className="text-gray-400 hover:text-primary"><AlignCenter size={18}/></Button>
                        <Button variant="ghost" size="icon" onClick={flipObject} className="text-gray-400 hover:text-primary"><FlipHorizontal size={18}/></Button>
                        <Button variant="ghost" size="icon" onClick={duplicateObject} className="text-gray-400 hover:text-primary"><Copy size={18}/></Button>
                        <Button variant="ghost" size="icon" onClick={bringForward} className="text-gray-400 hover:text-primary"><MoveUp size={18}/></Button>
                        <Button variant="ghost" size="icon" onClick={sendBackward} className="text-gray-400 hover:text-primary"><MoveDown size={18}/></Button>
                        <Button variant="ghost" size="icon" onClick={deleteSelected} className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={18}/></Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-1 rounded-xl flex">
                        <Button variant="ghost" size="sm" onClick={() => setViewMode('edit')} className={`${viewMode === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:bg-gray-200'} rounded-lg text-xs font-bold px-4 transition-all`}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                            try {
                                if (canvas) {
                                    setPreviewUrl(canvas.toDataURL({ format: 'png', multiplier: 2 }));
                                }
                            } catch (e) {
                                console.error("Failed to generate preview", e);
                            }
                            setViewMode('preview');
                        }} className={`${viewMode === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:bg-gray-200'} rounded-lg text-xs font-bold px-4 transition-all`}>Preview</Button>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl border border-gray-100 text-gray-400"><Palette size={20}/></Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* --- LEFT SIDEBAR (Icon Rail) --- */}
                <aside className="w-24 bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-8 overflow-y-auto">
                    <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => setActiveTab('upload')}>
                        <div className={`p-4 rounded-2xl transition-all ${activeTab === 'upload' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            <Upload size={24} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight ${activeTab === 'upload' ? 'text-primary' : 'text-gray-400'}`}>Upload</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => setActiveTab('text')}>
                        <div className={`p-4 rounded-2xl transition-all ${activeTab === 'text' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            <Type size={24} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight ${activeTab === 'text' ? 'text-primary' : 'text-gray-400'}`}>Add Text</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => setActiveTab('ai')}>
                        <div className={`p-4 rounded-2xl transition-all ${activeTab === 'ai' ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            <ImageOff size={24} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight ${activeTab === 'ai' ? 'text-primary' : 'text-gray-400'}`}>Magic Tools</span>
                    </div>
                </aside>

                {/* --- TOOL FLYOUT --- */}
                <aside className="w-80 bg-white border-r border-gray-50 p-6 flex flex-col gap-6 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-40">
                    {activeTab === 'upload' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-1">My Assets</h3>
                                <p className="text-xs text-gray-400 font-bold">Upload designs from your device</p>
                            </div>
                            
                            <label className="w-full flex-col h-40 border-2 border-dashed border-gray-100 rounded-[24px] flex items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden relative">
                                {uploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                                <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black">Click to upload</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Typography</h3>
                                <p className="text-xs text-gray-400 font-bold">Add and style your message</p>
                            </div>
                            
                            <Button onClick={() => addText('standard')} className="w-full py-7 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition active:translate-y-0">
                                <Type size={16} className="mr-2" /> Add Text Layer
                            </Button>

                            <div className="grid grid-cols-1 gap-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Presets</p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:border-primary transition" onClick={() => addText('headline')}>
                                    <span className="text-lg font-black tracking-tight">Headline Bold</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:border-primary transition" onClick={() => addText('subheading')}>
                                    <span className="text-sm font-bold italic">Subheading Italic</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-1">AI Enhancements</h3>
                                <p className="text-xs text-gray-400 font-bold">Professional real-time editing</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button variant="outline" onClick={() => applyAITransformation('e-bgremove')} className="w-full py-8 rounded-2xl border-gray-100 hover:border-primary hover:bg-primary/5 flex flex-col h-auto gap-1">
                                    <div className="flex items-center gap-3">
                                        <ImageOff size={18} className="text-primary" />
                                        <span className="font-bold text-gray-900">Remove Background</span>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">One-click magic</span>
                                </Button>

                                <Button variant="outline" onClick={() => applyAITransformation('e-shadow')} className="w-full py-8 rounded-2xl border-gray-100 hover:border-primary hover:bg-primary/5 flex flex-col h-auto gap-1">
                                    <div className="flex items-center gap-3">
                                        <GalleryVerticalEnd size={18} className="text-primary" />
                                        <span className="font-bold text-gray-900">Drop Shadow</span>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Add realistic depth</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>

                {/* --- MAIN CANVAS AREA --- */}
                <main className="flex-1 relative flex items-center justify-center p-12 bg-[#F3F4F6] overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    
                    {/* Sticky Side Images (Variants) - ONLY IN PREVIEW MODE */}
                    {viewMode === 'preview' && (
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30">
                            {product?.productImage && product.productImage.length > 5 && variantStartIndex > 0 && (
                                <Button variant="ghost" size="icon" onClick={() => setVariantStartIndex(prev => prev - 1)} className="h-8 w-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm"><ChevronUp size={16}/></Button>
                            )}
                            <div className="flex flex-col gap-3">
                                {product?.productImage?.slice(variantStartIndex, variantStartIndex + 5).map((img: any, i: number) => {
                                    const actualIndex = variantStartIndex + i;
                                    return (
                                        <div 
                                            key={actualIndex}
                                            onClick={() => setSelectedVariant(actualIndex)}
                                            className={`w-16 h-16 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-sm overflow-hidden flex items-center justify-center group ${selectedVariant === actualIndex ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-gray-200'}`}
                                        >
                                            <Image src={img.url} alt={`Variant ${actualIndex}`} width={60} height={60} className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                    )
                                })}
                            </div>
                            {product?.productImage && product.productImage.length > 5 && variantStartIndex + 5 < product.productImage.length && (
                                <Button variant="ghost" size="icon" onClick={() => setVariantStartIndex(prev => prev + 1)} className="h-8 w-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm"><ChevronDown size={16}/></Button>
                            )}
                        </div>
                    )}

                    <div className="relative group transition-all duration-700 flex items-center justify-center w-full h-full">
                        
                        {/* EDIT MODE CONTAINER */}
                        <div className={`relative ${viewMode === 'edit' ? 'flex' : 'hidden'} items-center justify-center flex-col`}>
                            {/* Shadow underneath */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="w-[500px] h-[500px] relative flex items-center justify-center overflow-hidden bg-gray-50 rounded-xl">
                                { (currentSide === 'front' ? product?.mockup2dFront : product?.mockup2dBack) && (
                                    <Image 
                                        src={(currentSide === 'front' ? product?.mockup2dFront : product?.mockup2dBack) as string} 
                                        alt={`${currentSide} Base`} 
                                        width={500} 
                                        height={500} 
                                        className="w-full h-full object-contain pointer-events-none" 
                                    />
                                )}
                                {(() => {
                                    const activePrintArea = currentSide === 'front' 
                                        ? (product?.printAreaFront || { x: 0, y: 0, width: 100, height: 100 })
                                        : (product?.printAreaBack || { x: 0, y: 0, width: 100, height: 100 });
                                    
                                    return (
                                        <div 
                                            className="absolute z-10 flex items-center justify-center border-2 border-dashed border-primary"
                                            style={{
                                                left: `${activePrintArea.x}%`,
                                                top: `${activePrintArea.y}%`,
                                                width: `${activePrintArea.width}%`,
                                                height: `${activePrintArea.height}%`
                                            }}
                                        >
                                            <canvas ref={canvasRef} className="cursor-crosshair w-full h-full" />
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>

                        {/* PREVIEW MODE CONTAINER */}
                        <div className={`relative ${viewMode === 'preview' ? 'flex' : 'hidden'} w-[600px] h-[600px] items-center justify-center bg-white rounded-[32px] shadow-2xl p-4 transition-all overflow-hidden`}>
                            <div className="relative w-full h-full flex items-center justify-center">
                                {product?.productImage?.[selectedVariant] && (
                                    <img 
                                        src={product.productImage[selectedVariant].url}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                )}
                                {/* Overlay Design */}
                                {previewUrl && (
                                    <div 
                                        className="absolute pointer-events-none z-20 flex items-center justify-center"
                                        style={{
                                            left: `${product?.productImage?.[selectedVariant]?.overlayX ?? 25}%`,
                                            top: `${product?.productImage?.[selectedVariant]?.overlayY ?? 25}%`,
                                            width: `${product?.productImage?.[selectedVariant]?.overlayWidth ?? 50}%`,
                                            height: `${product?.productImage?.[selectedVariant]?.overlayHeight ?? 50}%`,
                                            mixBlendMode: 'multiply'
                                        }}
                                    >
                                        <img 
                                            src={previewUrl} 
                                            alt="Live Design Overlay"
                                            className="w-full h-full object-fill"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Control Overlays */}
                    {category?.hasFrontAndBack && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/40 p-1.5 rounded-2xl shadow-xl z-20">
                            <Button variant="ghost" size="sm" onClick={() => setCurrentSide('front')} className={`${currentSide === 'front' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/40'} text-xs font-black px-4 rounded-xl transition-colors`}>Front Side</Button>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentSide('back')} className={`${currentSide === 'back' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/40'} text-xs font-black px-4 rounded-xl transition-colors`}>Back Side</Button>
                        </div>
                    )}
                </main>

                {/* --- RIGHT SIDEBAR (Variants & Layers) --- */}
                <aside className="w-80 bg-white border-l border-gray-100 flex flex-col z-40 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
                    <div className="p-6 flex-1 overflow-y-auto">
                        {/* Product Options (Size) */}
                        {product?.sizes && product.sizes.length > 0 && (
                            <div className="mb-8 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Size</span>
                                    <Ratio size={14} className="text-gray-300" />
                                </div>
                                <div className="relative group">
                                    <select 
                                        value={selectedSize} 
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-black text-gray-700 outline-none focus:ring-4 ring-primary/5 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Size</option>
                                        {product.sizes.map((s: string) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        )}

                        {/* Transformation Editor */}
                        {selectedObject && (
                            <div className="mb-8 p-5 bg-gray-50 rounded-[24px] border border-gray-100 flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Palette size={14} className="text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Object Properties</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Width</label>
                                        <Input type="number" className="h-9 text-xs font-bold bg-white rounded-lg" value={Math.round(selectedObject.getScaledWidth())} onChange={e => updateObjectProp('scaleX', parseInt(e.target.value) / selectedObject.width!)} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Height</label>
                                        <Input type="number" className="h-9 text-xs font-bold bg-white rounded-lg" value={Math.round(selectedObject.getScaledHeight())} onChange={e => updateObjectProp('scaleY', parseInt(e.target.value) / selectedObject.height!)} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Rotate</label>
                                        <div className="flex items-center bg-white rounded-lg border border-input h-9 px-2">
                                            <Input type="number" className="border-none shadow-none h-auto p-0 text-xs font-bold focus-visible:ring-0" value={Math.round(selectedObject.angle!)} onChange={e => updateObjectProp('angle', parseInt(e.target.value))} />
                                            <span className="text-[10px] text-gray-400 font-bold">deg</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Scale</label>
                                        <div className="flex items-center bg-white rounded-lg border border-input h-9 px-2">
                                            <Input type="number" className="border-none shadow-none h-auto p-0 text-xs font-bold focus-visible:ring-0" value={Math.round(selectedObject.scaleX! * 100)} onChange={e => updateObjectProp('scaleX', parseInt(e.target.value) / 100)} />
                                            <span className="text-[10px] text-gray-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Layers</span>
                                <Layers size={14} className="text-gray-300" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {canvasLayers.length > 0 ? canvasLayers.map((layer) => (
                                    <div 
                                        key={layer.id}
                                        onClick={() => { canvas?.setActiveObject(layer.object); canvas?.renderAll(); setSelectedObject(layer.object); }}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${selectedObject === layer.object ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                                {layer.type === 'text-layer' || layer.type === 'i-text' ? <Type size={14} className="text-primary" /> : <ImageIcon size={14} className="text-primary" />}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{layer.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); canvas?.remove(layer.object); canvas?.renderAll(); }} className="h-7 w-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={12}/></Button>
                                    </div>
                                )) : (
                                    <div className="py-12 border-2 border-dashed border-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                                        <Layers size={32} className="text-gray-100" />
                                        <p className="text-[10px] font-black uppercase text-gray-300">No objects added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border-t border-gray-50 mt-auto">
                        <Button 
                            onClick={handleSave} 
                            disabled={canvasLayers.length === 0}
                            className={`w-full py-8 rounded-[24px] font-black text-md shadow-2xl transition group ${
                                canvasLayers.length === 0 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-primary text-white shadow-primary/30 hover:-translate-y-1 active:translate-y-0'
                            }`}
                        >
                            <Save size={18} className={`mr-3 ${canvasLayers.length > 0 ? 'group-hover:rotate-12' : ''} transition-transform`} /> Save Design
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
