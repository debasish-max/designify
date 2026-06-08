"use client";

import { motion } from "framer-motion";
import { Paintbrush, Printer, Truck, Tag } from "lucide-react";

const features = [
  {
    title: "Design in Minutes",
    desc: "Real-time editor for instant preview. Bring your ideas to life instantly with our intuitive 3D preview tools.",
    icon: Paintbrush,
  },
  {
    title: "Premium Print",
    desc: "High-quality long-lasting prints. We use industry-leading DTG and sublimation techniques for vibrant colors.",
    icon: Printer,
  },
  {
    title: "Fast Delivery",
    desc: "Quick shipping across Assam. Localized fulfillment means your custom products arrive at your doorstep in record time.",
    icon: Truck,
  },
  {
    title: "Best Pricing",
    desc: "Affordable custom printing. Enjoy wholesale pricing on premium merchandise without the massive bulk requirements.",
    icon: Tag,
  },
];

export default function FeatureClean3D() {
  return (
    <section className="bg-white py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="flex flex-col items-start text-left mb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black tracking-widest uppercase mb-6">
            The Designify Difference
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Why Choose Us
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            Built for individuals, creators, and businesses. We combine cutting-edge design technology with premium materials to deliver custom merchandise that exceeds your expectations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-20">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group bg-[#f8f9fa] rounded-[2.5rem] p-10 border border-black/[0.03] shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col items-start relative overflow-hidden"
              >
                {/* Large faint icon in background */}
                <div className="absolute -top-4 -right-4 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none text-black">
                  <Icon size={140} strokeWidth={1} />
                </div>

                <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-black/[0.04] shadow-sm flex items-center justify-center mb-8 group-hover:bg-[#111] group-hover:text-white transition-colors duration-500 text-[#111] relative z-10">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-[#111] mb-4 tracking-tighter relative z-10">
                  {f.title}
                </h3>
                <p className="text-[15px] text-gray-600 font-medium leading-relaxed relative z-10">
                  {f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Upgraded Bottom CTA */}
        <div className="bg-[#111] rounded-[2.5rem] p-10 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="text-center md:text-left z-10 max-w-2xl">
            <h3 className="text-4xl font-black text-white mb-5 tracking-tighter">Ready to bring your ideas to life?</h3>
            <p className="text-white/70 text-[17px] leading-relaxed">
              Start customizing your first product today. Turn your memories, artwork, or logos into high-quality custom merchandise with vibrant, lasting results.
            </p>
          </div>
          
          <div className="z-10 shrink-0">
            <a href="/products" className="inline-flex h-16 items-center justify-center px-10 rounded-full bg-white text-[#111] font-black text-[13px] uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]">
              Start Designing
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}