import Image from "next/image";
import { ArrowRight, CheckCircle2, Shirt, ShoppingBag, Image as ImageIcon, Map, Flag } from "lucide-react";

export default function AestheticGallery() {
  return (
    <section className="w-full bg-[#f8f9fa] py-20 px-4 md:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-start text-left mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black tracking-widest uppercase mb-6">
            The Collection
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] tracking-tight leading-[1.1] mb-6">
            Make It Yours
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            From everyday apparel to stunning wall art, transform your ideas into high-quality custom pieces crafted just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5 lg:gap-6 lg:h-[760px]">
        
        {/* Custom Apparel - Spans 2 rows (Column 1) */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#e6e2db] col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 group min-h-[450px] lg:min-h-0 flex flex-col shadow-sm">
          
          <Image
            src="/apparel_white_v3.png"
            alt="Custom Apparel"
            fill
            className="object-cover object-bottom transition-transform duration-1000 group-hover:scale-105"
          />

          <div className="relative z-10 p-10 flex flex-col h-full w-full justify-between pointer-events-none">
            <div className="w-full pointer-events-auto">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Shirt className="w-3.5 h-3.5 text-black" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-black uppercase mt-[1px]">
                  Streetwear
                </span>
              </div>
              <h3 className="text-4xl lg:text-[2.75rem] leading-[1.05] font-black text-[#111] mb-5 tracking-tighter drop-shadow-sm">Custom<br/>Apparel</h3>
              <p className="text-[14px] text-gray-800 font-medium leading-relaxed drop-shadow-sm max-w-[170px] mb-4">
                Design premium apparel that expresses your unique style.
              </p>
              <div className="flex flex-col items-start gap-2 max-w-[200px]">
                <span className="text-[11px] font-bold bg-white/60 backdrop-blur-sm border border-white/50 px-2.5 py-1 rounded-md text-[#111] shadow-sm">T-Shirts</span>
                <span className="text-[11px] font-bold bg-white/60 backdrop-blur-sm border border-white/50 px-2.5 py-1 rounded-md text-[#111] shadow-sm">Hoodies</span>
                <span className="text-[11px] font-bold bg-white/60 backdrop-blur-sm border border-white/50 px-2.5 py-1 rounded-md text-[#111] shadow-sm">Sweatshirts</span>
              </div>
            </div>
            
            <div className="mt-4 pointer-events-auto">
              <button className="group/btn inline-flex items-center justify-center space-x-2 bg-[#020b14] text-white px-7 py-4 rounded-full text-xs font-bold hover:bg-black transition-all duration-300 w-max shadow-lg">
                <span>Explore Apparel</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Prints - Wide (Columns 2 & 3, Row 1) */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#e8e9eb] col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 group min-h-[350px] lg:min-h-0 shadow-sm">
          
          <Image
            src="/gallery_new.png"
            alt="Gallery Prints"
            fill
            className="object-cover object-right transition-transform duration-1000 group-hover:scale-105"
          />

          <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full w-full justify-between pointer-events-none">
            <div className="w-full md:w-[60%] lg:w-[55%] pointer-events-auto">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5 text-black" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-black uppercase mt-[1px]">
                  Wall Art
                </span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#111] mb-4 leading-[1.05] tracking-tighter drop-shadow-sm">Gallery<br/>Prints</h3>
              <p className="text-[15px] text-gray-800 font-medium max-w-[280px] leading-relaxed drop-shadow-sm">
                Exquisite, high-definition prints designed to transform your walls into a personal gallery.
              </p>
            </div>
            <div className="mt-4 pointer-events-auto">
              <button className="group/btn inline-flex items-center justify-center space-x-2 bg-[#020b14] text-white px-7 py-4 rounded-full text-xs font-bold hover:bg-black transition-all duration-300 shadow-lg w-max">
                <span>Explore Prints</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Start Your Collection - Spans 2 rows (Column 4) */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#e5e4df] col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 p-10 lg:p-12 flex flex-col group min-h-[450px] lg:min-h-0 shadow-sm border border-black/[0.03]">
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-14 h-14 bg-white/50 border border-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 shadow-sm">
                <ShoppingBag className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#111] mb-6 leading-[1.05] tracking-tighter">Bring Ideas<br/>to Life</h3>
              <p className="text-[15px] text-gray-700 font-medium mb-12 leading-relaxed pr-4">
                Turn your memories, artwork, or logos into high-quality custom merchandise with vibrant, lasting results.
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-center text-[15px] font-medium text-[#111]">
                  <CheckCircle2 className="w-5 h-5 mr-4 text-[#111] shrink-0" /> 
                  <span>Premium materials</span>
                </li>
                <li className="flex items-center text-[15px] font-medium text-[#111]">
                  <CheckCircle2 className="w-5 h-5 mr-4 text-[#111] shrink-0" /> 
                  <span>No minimum orders</span>
                </li>
                <li className="flex items-center text-[15px] font-medium text-[#111]">
                  <CheckCircle2 className="w-5 h-5 mr-4 text-[#111] shrink-0" /> 
                  <span>Fast local delivery</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-10">
              <button className="group/btn w-full flex items-center justify-between bg-[#020b14] text-white px-7 py-4.5 rounded-full text-[14px] font-bold hover:bg-black transition-all duration-300 shadow-lg">
                <span>Start Designing</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Posters (Column 2, Row 2) */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#e0d6c8] col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 group min-h-[300px] lg:min-h-0 shadow-sm">
          <Image
            src="/poster_new.png"
            alt="Posters"
            fill
            className="object-cover object-right transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="relative z-10 p-10 flex flex-col h-full w-full justify-between">
            <div className="w-full">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Map className="w-3.5 h-3.5 text-black" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-black uppercase mt-[1px]">
                  Posters
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#111] mb-3 leading-[1.05] tracking-tighter drop-shadow-sm">Posters</h3>
              <p className="text-[13px] text-gray-800 font-medium leading-relaxed max-w-[140px] drop-shadow-sm">
                High-resolution statement pieces.
              </p>
            </div>
            <div className="mt-6">
              <button className="group/btn inline-flex items-center justify-center space-x-2 bg-white text-[#111] px-6 py-3.5 rounded-full text-[11px] font-bold hover:bg-gray-50 shadow-md transition-all duration-300 w-max">
                <span>Explore Posters</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Banners (Column 3, Row 2) */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#d0d3d5] col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 group min-h-[300px] lg:min-h-0 shadow-sm">
          <Image
            src="/banner_white.png"
            alt="Banners"
            fill
            className="object-cover object-right transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="relative z-10 p-10 flex flex-col h-full w-full justify-between">
            <div className="w-full">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Flag className="w-3.5 h-3.5 text-black" />
                <span className="text-[10px] font-bold tracking-[0.15em] text-black uppercase mt-[1px]">
                  Banners
                </span>
              </div>
              <h3 className="text-3xl font-black text-[#111] mb-3 leading-[1.05] tracking-tighter drop-shadow-sm">Banners</h3>
              <p className="text-[13px] text-gray-800 font-medium leading-relaxed max-w-[130px] drop-shadow-sm">
                Bold, durable banners for any occasion.
              </p>
            </div>
            <div className="mt-6">
              <button className="group/btn inline-flex items-center justify-center space-x-2 bg-white text-[#111] px-6 py-3.5 rounded-full text-[11px] font-bold hover:bg-gray-50 shadow-md transition-all duration-300 w-max">
                <span>Explore Banners</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
    </section>
  );
}
