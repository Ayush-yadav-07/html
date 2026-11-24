import React, { useState } from 'react';

interface LogoItem {
  name: string;
  src: string;
  gradient: string;
  fallbackText: string;
}

const LOGOS: LogoItem[] = [
  {
    name: 'Procure',
    src: 'https://svgl.app/library/procure.svg',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    fallbackText: 'Procure',
  },
  {
    name: 'Shopify',
    src: 'https://svgl.app/library/shopify.svg',
    gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
    fallbackText: 'Shopify',
  },
  {
    name: 'Blender',
    src: 'https://svgl.app/library/blender.svg',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    fallbackText: 'Blender',
  },
  {
    name: 'Figma',
    src: 'https://svgl.app/library/figma.svg',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    fallbackText: 'Figma',
  },
  {
    name: 'Spotify',
    src: 'https://svgl.app/library/spotify.svg',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
    fallbackText: 'Spotify',
  },
  {
    name: 'Lottielab',
    src: 'https://svgl.app/library/lottielab.svg',
    gradient: 'linear-gradient(135deg, #facc15 0%, #22c55e 100%)',
    fallbackText: 'Lottielab',
  },
  {
    name: 'Google Cloud',
    src: 'https://svgl.app/library/google-cloud.svg',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 100%)',
    fallbackText: 'Google Cloud',
  },
  {
    name: 'Bing',
    src: 'https://svgl.app/library/bing.svg',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)',
    fallbackText: 'Bing',
  },
];

export const MarqueeScroller: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setImageErrors((prev) => ({ ...prev, [name]: true }));
  };

  // Render the list twice inline to ensure a seamless infinite loop
  const seamlessList = [...LOGOS, ...LOGOS];

  return (
    <div
      className="mt-10 w-full overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div className="animate-marquee flex items-center gap-6 py-4">
        {seamlessList.map((logo, index) => {
          const hasError = imageErrors[`${logo.name}-${index % LOGOS.length}`];

          return (
            <div
              key={`${logo.name}-${index}`}
              className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden"
            >
              {/* Gradient layer: scaled at 1.5 and 0 opacity, drops to scale 1 and opacity 100 on group-hover */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 rounded-full"
                style={{ background: logo.gradient }}
              />

              {/* Logo / Brand vector mark */}
              {!hasError ? (
                <img
                  src={logo.src}
                  alt={logo.name}
                  onError={() => handleImageError(`${logo.name}-${index % LOGOS.length}`)}
                  className="relative z-10 h-7 max-h-8 w-auto max-w-[65%] object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  loading="lazy"
                />
              ) : (
                <span className="relative z-10 text-[13px] font-semibold text-[#0a1b33] transition-colors duration-300 group-hover:text-white">
                  {logo.fallbackText}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
