"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Skip horizontal scroll on mobile completely
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const wrapper = wrapperRef.current!;

      const tween = gsap.to(container, {
        xPercent: -100 * (container.children.length - 1) / container.children.length,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 0.05,
          snap: 1 / (container.children.length - 1),
          end: () => "+=" + container.offsetWidth,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          panel.querySelectorAll(".anim-text"),
          { opacity: 0, y: 30, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
        ).fromTo(
          panel.querySelectorAll(".anim-card"),
          { opacity: 0, scale: 0.85, rotateY: 12 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.5)" },
          "-=0.3"
        );
      });

      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const inner = card.querySelector(".tilt-inner") as HTMLElement;
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(inner, {
            rotateY: x * 15,
            rotateX: -y * 15,
            transformPerspective: 900,
            duration: 0.15,
            ease: "power1.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  const products = [
    {
      img: "/tshirt.png",
      label: "T-Shirts",
      desc: "Wear your creativity",
      area: { top: "38%", width: "36%", height: "28%" },
    },
    {
      img: "/poster.png",
      label: "Posters",
      desc: "Make a statement",
      area: { top: "22%", width: "44%", height: "36%" },
    },
    {
      img: "/banner.png",
      label: "Sweat-Shirt",
      desc: "Create with your imagination",
      area: { top: "30%", width: "46%", height: "30%" },
    },
  ];

  // ✅ MOBILE LAYOUT - simple vertical scroll
  if (isMobile) {
    return (
      <section className="bg-white py-12 px-6">
        {/* Intro */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
            Real-time preview
          </p>
          <h1 className="text-4xl font-bold leading-none">See Your</h1>
          <h1 className="text-4xl font-bold leading-none text-primary">Design</h1>
          <h1 className="text-4xl font-bold leading-none">Come Alive</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Customize anything before printing.
          </p>
        </div>

        {/* Products */}
        {products.map((item, i) => (
          <div key={i} className="flex items-center gap-4 mb-10">
            <div className="relative w-[140px] flex-shrink-0">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-auto object-contain drop-shadow-lg"
              />
              <div
                className="absolute left-1/2 overflow-hidden"
                style={{
                  top: item.area.top,
                  transform: "translateX(-50%)",
                  width: item.area.width,
                  height: item.area.height,
                }}
              >
                <img
                  src="/design.png"
                  alt="design"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
                0{i + 1}
              </p>
              <h2 className="text-2xl font-bold leading-tight">{item.label}</h2>
              <p className="text-gray-500 mt-1 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}

        {/* Outro */}
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
            All in one place
          </p>
          <h2 className="text-4xl font-bold leading-none">Print Anything</h2>
          <h2 className="text-4xl font-bold leading-none text-primary">You Want</h2>
          <p className="text-gray-500 mt-2 text-sm">
            T-shirts, posters, banners — customized and delivered to you.
          </p>
        </div>
      </section>
    );
  }

  // ✅ DESKTOP LAYOUT - horizontal scroll
  return (
    <section ref={wrapperRef} className="overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="flex h-screen will-change-transform"
        style={{ width: `${(products.length + 2) * 100}vw` }}
      >
        {/* Intro Panel */}
        <div className="panel w-screen h-screen flex-shrink-0 flex items-center px-6 md:px-14 lg:px-20">
          <div className="max-w-xl">
            <p className="anim-text text-xs font-semibold tracking-widest text-primary uppercase mb-2">
              Real-time preview
            </p>
            <h1 className="anim-text text-4xl md:text-6xl lg:text-7xl font-bold leading-none">
              See Your
            </h1>
            <h1 className="anim-text text-4xl md:text-6xl lg:text-7xl font-bold leading-none text-primary">
              Design
            </h1>
            <h1 className="anim-text text-4xl md:text-6xl lg:text-7xl font-bold leading-none">
              Come Alive
            </h1>
            <p className="anim-text text-gray-500 mt-2 text-sm md:text-base">
              Customize anything before printing. Scroll to explore →
            </p>
          </div>
        </div>

        {/* Product Panels */}
        {products.map((item, i) => (
          <div
            key={i}
            className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center gap-3 md:gap-4 px-4"
          >
            <div className="anim-card tilt-card w-[160px] sm:w-[200px] md:w-[260px] lg:w-[300px]">
              <div className="tilt-inner relative select-none">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-auto object-contain block drop-shadow-xl"
                  draggable={false}
                />
                <div
                  className="absolute left-1/2 overflow-hidden"
                  style={{
                    top: item.area.top,
                    transform: "translateX(-50%)",
                    width: item.area.width,
                    height: item.area.height,
                  }}
                >
                  <img
                    src="/design.png"
                    alt="design"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="anim-text text-xs font-semibold tracking-widest text-primary uppercase mb-1">
                0{i + 1}
              </p>
              <h2 className="anim-text text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {item.label}
              </h2>
              <p className="anim-text text-gray-500 mt-1 text-sm md:text-base">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Outro Panel */}
        <div className="panel w-screen h-screen flex-shrink-0 flex items-center px-6 md:px-14 lg:px-20">
          <div className="max-w-xl">
            <p className="anim-text text-xs font-semibold tracking-widest text-primary uppercase mb-2">
              All in one place
            </p>
            <h2 className="anim-text text-4xl md:text-6xl lg:text-7xl font-bold leading-none">
              Print Anything
            </h2>
            <h2 className="anim-text text-4xl md:text-6xl lg:text-7xl font-bold leading-none text-primary">
              You Want
            </h2>
            <p className="anim-text text-gray-500 mt-2 text-sm md:text-base">
              T-shirts, posters, banners — customized and delivered to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}