'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export type CarouselSlide = {
  id: number | string;
  image: string;
  alt?: string;
  href?: string;
};

const defaultSlides: CarouselSlide[] = [
  // { id: 1, image: '/carousel/banner-1.png', alt: 'Banner 1' },
  { id: 3, image: '/carousel/Banner-3.png', alt: 'Banner 3' },
];

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  slides = defaultSlides,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);

  useEffect(() => {
    if (!autoPlayInterval || total <= 1) return;
    const id = setInterval(next, autoPlayInterval);
    return () => clearInterval(id);
  }, [next, autoPlayInterval, total]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-3 sm:my-4 md:my-6">
      {/* LEFT: Carousel */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-xl h-[220px] sm:h-[260px] md:h-[320px] lg:h-[420px]">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => {
            const img = (
              <img
                src={slide.image}
                alt={slide.alt || `Slide ${slide.id}`}
                className="block w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[420px] "
              />
            );
            return (
              <div key={slide.id} className="min-w-full h-full">
                {slide.href ? <Link href={slide.href}>{img}</Link> : img}
              </div>
            );
          })}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Cards */}
      <div className="flex flex-col gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md flex flex-col justify-between h-[200px] lg:h-[calc(50%-8px)]">
          <div>
            <div className="mb-3 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              🧪
            </div>
            <h3 className="text-lg font-semibold">Lab Tests at Home</h3>
            <p className="text-sm text-white/80 mt-1">
              Sample collection by certified phlebotomists, reports in 24h.
            </p>
          </div>

          <button className="mt-4 w-fit px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm">
            Book now →
          </button>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md flex flex-col justify-between h-[200px] lg:h-[calc(50%-8px)]">
          <div>
            <div className="mb-3 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              ⬆️
            </div>
            <h3 className="text-lg font-semibold">Upload Prescription</h3>
            <p className="text-sm text-white/80 mt-1">
              Snap, upload, and we'll call back in 10 minutes. Up to 14% off.
            </p>
          </div>

          <button className="mt-4 w-fit px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm">
            Upload now →
          </button>
        </div>
      </div>
    </div>
  );
}
