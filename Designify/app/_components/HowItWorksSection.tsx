"use client";

import { motion } from "framer-motion";
import { Package, Palette, Truck, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Choose Product",
    desc: "Select from our premium range of T-shirts, posters, mugs, and more.",
    icon: <Package className="w-8 h-8 text-orange-500" />,
    color: "bg-orange-50",
  },
  {
    title: "Customize Design",
    desc: "Use our real-time editor to upload your art or create a design from scratch.",
    icon: <Palette className="w-8 h-8 text-purple-500" />,
    color: "bg-purple-50",
  },
  {
    title: "Place Order",
    desc: "Enjoy fast, secure checkout and quick delivery straight to your door.",
    icon: <Truck className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-50",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gray-50/40 border-t border-gray-100 py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="flex flex-col items-start text-left mb-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black tracking-widest uppercase mb-6"
          >
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 mt-6 leading-relaxed"
          >
            Transform your ideas into high-quality custom merchandise in just three simple steps. Whether you're building a brand, outfitting a team, or creating a unique gift, our platform makes the entire process seamless from start to finish.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connector Line (Desktop) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden md:block absolute top-[80px] left-[16%] right-[16%] h-[4px] bg-gradient-to-r from-orange-200 via-purple-200 to-blue-200 z-0 rounded-full"
          ></motion.div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative z-10"
            >
              <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group h-full flex flex-col items-center text-center">
                
                {/* Icon Container */}
                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500`}>
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                    {i + 1}
                  </div>
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center"
        >
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white rounded-xl font-semibold shadow-lg shadow-black/10 hover:bg-black hover:-translate-y-0.5 transition-all group">
            Start Designing Now 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}