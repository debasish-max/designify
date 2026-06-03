import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShoppingBag, Star, Truck, ShieldCheck } from 'lucide-react'

function Hero() {
  return (
    <section className="bg-gray-50/30 pt-12 pb-20 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">

          {/* TEXT AREA */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-black tracking-widest uppercase mb-8 shadow-sm">
              <Sparkles size={14} className="fill-orange-600" />
              Print Your Style
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black text-[#111827] leading-[1.1] tracking-tight mb-6">
              Design it your way.<br />
              We print it <span className="text-gray-500">perfectly.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-[500px] mb-10">
              Create custom posters, t-shirts, mugs, photo frames and more. Premium quality prints, delivered to your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F172A] text-white rounded-xl font-semibold hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg shadow-black/10"
              >
                Start Designing <ArrowRight size={18} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm hover:-translate-y-0.5"
              >
                <ShoppingBag size={18} /> Explore Products
              </Link>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-8 border-t border-gray-200/60 w-full max-w-[600px]">
              {/* Feature 1 */}
              <div className="flex items-center lg:items-start xl:items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                  <Star size={18} className="fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm leading-tight">50+</div>
                  <div className="text-[13px] text-gray-500 leading-tight mt-0.5">Happy Customers</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center lg:items-start xl:items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Truck size={18} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm leading-tight">Fast</div>
                  <div className="text-[13px] text-gray-500 leading-tight mt-0.5">Delivery Across Assam</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center lg:items-start xl:items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm leading-tight">100%</div>
                  <div className="text-[13px] text-gray-500 leading-tight mt-0.5">Secure & Reliable</div>
                </div>
              </div>
            </div>

          </div>

          {/* IMAGE AREA */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[600px] aspect-[4/3] lg:aspect-square">
              <Image
                src="/right_side_design.png"
                alt="Hero Right Side Design"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>



      </div>
    </section>
  )
}

export default Hero
