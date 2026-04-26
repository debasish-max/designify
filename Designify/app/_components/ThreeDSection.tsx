"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Design in Minutes",
    desc: "Real-time editor for instant preview",
  },
  {
    title: "Premium Print",
    desc: "High-quality long-lasting prints",
  },
  {
    title: "Fast Delivery",
    desc: "Quick shipping across Assam",
  },
  {
    title: "Best Pricing",
    desc: "Affordable custom printing",
  },
];

export default function FeatureClean3D() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose Us
          </h2>
          <p className="text-gray-500 mt-2">
            Built for individuals, creators and businesses
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}