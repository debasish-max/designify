import dynamic from "next/dynamic";

import Hero from "./_components/Hero";

const Categories = dynamic(() => import("./_components/Categories"));
const PopularProducts = dynamic(() => import("./_components/PopularProducts"));
const Footer = dynamic(() => import("./_components/Footer"));
const ThreeDSection = dynamic(() => import("./_components/ThreeDSection"));
const HowItWorksSection = dynamic(() => import("./_components/HowItWorksSection"));
const ScrollShowcase = dynamic(() => import("./_components/ScrollShowcase"));
const AestheticGallery = dynamic(() => import("./_components/AestheticGallery"));

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <Hero />

      <ScrollShowcase />

      {/* How it works */}
      <HowItWorksSection />

      {/* Category list*/}
      <Categories />

      {/* Product list*/}
      <PopularProducts />

      {/* Real Life Photo Gallery */}
      <AestheticGallery />

      {/* Why Choose Us */}
      <ThreeDSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
