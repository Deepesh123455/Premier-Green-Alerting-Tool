import React from 'react';
import Image from 'next/image';

interface BrandHeaderProps {
  terminalLabel: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ terminalLabel }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#234D42] text-white border-b border-[#1b3d34] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Premier Green Innovations Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white leading-tight truncate">
                Premier Green Innovations
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#AAB6AE] font-medium tracking-wide flex items-center gap-1 leading-none mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0"></span>
                <span className="hidden xs:inline truncate">Spirit of Green • </span>
                <span>Operations Hub</span>
              </span>
            </div>
          </div>

          {/* Sleek Terminal Badge */}
          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-xs whitespace-nowrap shrink-0 shadow-2xs">
            {terminalLabel}
          </span>
        </div>
      </div>
    </header>
  );
};
