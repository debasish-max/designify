"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Choose Product",
    desc: "Select from T-shirts, posters, mugs & more",
    icon: "🛍️",
  },
  {
    title: "Customize Design",
    desc: "Upload or create your own design easily",
    icon: "🎨",
  },
  {
    title: "Place Order",
    desc: "Fast checkout & quick delivery to your door",
    icon: "🚚",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800">
          How It Works
        </h2>
        <p className="text-gray-500 mt-2">
          Create your custom product in just 3 simple steps
        </p>

        {/* Steps */}
        <div className="relative mt-16 grid md:grid-cols-3 gap-10">
          
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2">
                
                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {step.title}
                </h3>

                {/* Desc */}
                <p className="text-sm text-gray-500 mt-2">
                  {step.desc}
                </p>
              </div>

              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full shadow">
                Step {i + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition">
            Start Designing Now →
          </button>
        </div>
      </div>
    </section>
  );
}