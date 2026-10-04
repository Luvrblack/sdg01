import React from 'react';
import { useData } from '../context/DataContext';

interface SdgLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  customLogoUrl?: string;
}

export const SdgLogo: React.FC<SdgLogoProps> = ({ className = '', showText = true, size = 'md', customLogoUrl }) => {
  const { siteConfig } = useData();
  const iconSize = size === 'sm' ? 'w-6 h-[27px]' : size === 'lg' ? 'w-12 h-[54px]' : 'w-8 h-[36px]';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  // High-fidelity SVG Data URL default
  const defaultLogoUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 112'><path d='M 44.5 4.5 Q 50 1.3 55.5 4.5 L 91.5 25.3 Q 97 28.5 97 34.8 L 97 76.2 Q 97 82.5 91.5 85.7 L 55.5 106.5 Q 50 109.7 44.5 106.5 L 8.5 85.7 Q 3 82.5 3 76.2 L 3 34.8 Q 3 28.5 8.5 25.3 Z' fill='%2300D387'/><path d='M 3.2 45 C 6 25 25 15 50 15 C 66 15 80 20 92 28 C 78 38 62 40 42 41 C 24 42 11 44.5 3.2 45 Z' fill='white'/><path d='M 96.8 66 C 94 86 75 96 50 96 C 34 96 20 91 8 83 C 22 73 38 71 58 70 C 76 69 89 66.5 96.8 66 Z' fill='white'/><text x='52' y='85' fill='%2300D387' fill-opacity='0.15' font-size='12' font-weight='900' font-family='sans-serif' transform='rotate(-12, 52, 85)' letter-spacing='0.1em'%3ESDG%3C/text%3E<text x='68' y='38' fill='white' font-size='12' font-weight='900' font-family='sans-serif'%3ETM%3C/text%3E</svg>";

  const activeLogoUrl = customLogoUrl || siteConfig?.logoUrl || defaultLogoUrl;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div className={`relative ${iconSize} shrink-0 flex items-center justify-center`}>
        <img
          src={activeLogoUrl}
          className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(0,211,135,0.95)] hover:scale-110 hover:rotate-[6deg] active:scale-95 transition-all duration-300 cursor-pointer"
          alt="SDG Industries Logo"
          draggable={false}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold italic tracking-wider text-white ${textSize}`}>
            SDG <span className="text-emerald-400">INDUSTRIES</span>
          </span>
          <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-medium mt-0.5">
            Apparel & Distro
          </span>
        </div>
      )}
    </div>
  );
};

