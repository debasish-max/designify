"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Layers, Paintbrush, Zap } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: "tshirts",
    img: "/tshirt.png",
    label: "Premium T-Shirts",
    desc: "Wear your creativity with our high-quality, ultra-soft cotton tees.",
    icon: <Paintbrush className="w-6 h-6 text-orange-500" />,
    area: { top: "38%", width: "36%", height: "28%" },
  },
  {
    id: "posters",
    img: "/poster.png",
    label: "Wall Posters",
    desc: "Make a statement in any room with museum-grade matte print posters.",
    icon: <Layers className="w-6 h-6 text-purple-500" />,
    area: { top: "22%", width: "44%", height: "36%" },
  },
  {
    id: "sweatshirts",
    img: "/banner.png",
    label: "Cozy Sweatshirts",
    desc: "Warm, stylish, and customized entirely by you. Perfect for every season.",
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    area: { top: "30%", width: "46%", height: "30%" },
  },
];

export default function ScrollShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate which item should be active using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    blockRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white relative border-t border-gray-100">
      {/* Subtle Design Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Mobile Layout (Standard Flow) */}
      <div className="md:hidden py-16 px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[11px] font-black tracking-widest uppercase mb-4">
            <Sparkles size={14} className="fill-orange-600" /> Real-time preview
          </div>
          <h2 className="text-4xl font-black text-gray-900 leading-[1.1]">
            Premium Custom <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Products</span>
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {products.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-6">
              <div className="relative w-[280px] h-[280px] bg-white rounded-[32px] shadow-sm flex items-center justify-center p-6 border border-gray-100">
                <Image src={item.img} alt={item.label} width={280} height={280} className="w-full h-full object-contain drop-shadow-md" />
                <div
                  className="absolute left-1/2 overflow-hidden mix-blend-multiply opacity-90"
                  style={{
                    top: item.area.top,
                    transform: "translateX(-50%)",
                    width: item.area.width,
                    height: item.area.height,
                  }}
                >
                  <Image src="/design.png" alt="design" fill className="object-contain" />
                </div>
              </div>
              <div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{item.label}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sticky Scroll Layout */}
      <div className="hidden md:flex items-start relative pb-12">
        {/* Left Side: Sticky Image Showcase */}
        <div className="w-1/2 sticky top-0 h-screen flex items-center justify-center p-12 relative z-10 overflow-hidden">

          {/* Decorative Ambient Background */}
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-orange-400/10 rounded-full mix-blend-multiply filter blur-[80px]"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-[80px]"></div>

          <div className="relative z-10 w-full max-w-[500px] aspect-square bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex items-center justify-center overflow-hidden p-12">
            {products.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: activeIndex === i ? 1 : 0,
                  scale: activeIndex === i ? 1 : 0.9,
                  y: activeIndex === i ? 0 : 20,
                  pointerEvents: activeIndex === i ? "auto" : "none"
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center p-12"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                  <div
                    className="absolute left-1/2 overflow-hidden mix-blend-multiply opacity-90"
                    style={{
                      top: item.area.top,
                      transform: "translateX(-50%)",
                      width: item.area.width,
                      height: item.area.height,
                    }}
                  >
                    <Image
                      src="/design.png"
                      alt="design"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Scrolling Content */}
        <div className="w-1/2 relative z-10 py-[30vh]">
          {products.map((item, i) => (
            <div
              key={i}
              ref={(el) => { blockRefs.current[i] = el; }}
              data-index={i}
              className={`h-[40vh] flex flex-col justify-center px-16 xl:px-24 transition-all duration-500 ${activeIndex === i ? 'opacity-100 scale-100' : 'opacity-20 scale-95'}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Intro Badge only on first item */}
                {i === 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-black tracking-widest uppercase mb-8 shadow-sm">
                    <Sparkles size={14} className="fill-orange-600" />
                    Real-Time Preview
                  </div>
                )}

                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                  {item.icon}
                </div>

                <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                  {item.label}
                </h2>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-md">
                  {item.desc}
                </p>

              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}