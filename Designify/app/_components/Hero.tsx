import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 lg:gap-24">
          
          {/* IMAGE FIRST ON MOBILE */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/hero.png"
              alt="Hero Image"
              width={500}
              height={500}
              className="w-[250px] sm:w-[350px] md:w-[400px] lg:w-[500px] h-auto object-contain"
              priority
            />
          </div>

          {/* TEXT */}
          <div className="order-2 md:order-1 text-center md:text-left">
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Design,
              <span className="text-primary"> Customize </span>
              & Get It Delivered
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto md:mx-0">
              Easily personalize your print-on-demand products with just a few clicks.
              Create unique designs that reflect your style and personality.
            </p>

            {/* BUTTONS */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              
              <Link
                href="/products"
                className="w-full sm:w-auto text-center rounded bg-primary px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-gray-700 transition"
              >
                Start Designing
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto text-center rounded border border-gray-300 px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Explore Products
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
