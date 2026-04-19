// components/ScrollToTop.tsx
'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[9999] p-3 bg-[#388072] text-white rounded-full shadow-lg hover:bg-[#2d6a5a] transition-all duration-300 active:scale-90"
      aria-label="Scroll to top"
    >
      <Icon icon="solar:arrow-up-linear" className="w-6 h-6" />
    </button>
  );
}