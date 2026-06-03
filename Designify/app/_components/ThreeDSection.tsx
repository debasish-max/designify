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
        <div className="flex flex-col items-center text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black tracking-widest uppercase mb-6">
            The Designify Difference
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Why Choose Us
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Built for individuals, creators, and businesses. We combine cutting-edge design technology with premium materials to deliver custom merchandise that exceeds your expectations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500 text-gray-900">
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center max-w-2xl mx-auto p-10 bg-gray-50 rounded-[32px] border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Ready to bring your ideas to life?</h3>
          <p className="text-gray-500 mb-0">
            Start customizing your first product today with our easy-to-use editor. Whether it's a single t-shirt or a bulk order for your brand, we've got you covered.
          </p>
        </div>

      </div>
    </section>
  );
}