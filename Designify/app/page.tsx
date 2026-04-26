import Image from "next/image";

import Hero from "./_components/Hero";
import Categories from "./_components/Categories";
import PopularProducts from "./_components/PopularProducts";
import Footer from "./_components/Footer";
import ThreeDSection from "./_components/ThreeDSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import ScrollShowcase from "./_components/ScrollShowcase";

export default function Home() {
  return (
   <div>

    {/* Hero */}
    <Hero/>
    
    <ScrollShowcase/>

    {/* How it works */}
    <HowItWorksSection/>

    {/* Category list*/}
    <Categories/>

    {/* Product list*/}
    <PopularProducts/>
<ThreeDSection/>
    {/* Footer */}
    <Footer/>
   </div>
  );
}
