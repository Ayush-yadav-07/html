import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onContactClick: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onContactClick,
  onNavigateTab,
}) => {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
      {/* Underlying Video Layer (No Overlays) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          className="w-full h-full object-cover scale-105 transition-transform duration-1000"
        />
      </div>

      {/* Hero Text Content */}
      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start max-w-2xl"
        >
          <h1 className="font-display font-medium text-[42px] md:text-[56px] leading-[1.08] tracking-tight text-[#0a1b33]">
            Foundation of the
            <br />
            new digital epoch
          </h1>

          <p className="mt-4 font-sans text-[14px] md:text-[15px] leading-relaxed text-[#64748b] max-w-lg">
            Designing products, powering ecosystems and laying the foundation of
            a decentralized web for enterprises, builders and communities alike.
          </p>

          <div className="mt-7">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContactClick}
              className="bg-[#0a152d] text-white rounded-full px-7 py-3 text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Bottom Navbar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
        >
          {/* Logo placeholder */}
          <div className="w-9 h-9 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#0a1b33] text-[15px] font-medium select-none">
            ✦
          </div>

          {/* Standard text buttons */}
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('products')}
            className="px-4 py-2 text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors cursor-pointer"
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('docs')}
            className="px-4 py-2 text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors cursor-pointer"
          >
            Docs
          </button>

          {/* Get in touch button */}
          <button
            type="button"
            onClick={onContactClick}
            className="bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Get in touch</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </motion.nav>
      </div>
    </section>
  );
};
