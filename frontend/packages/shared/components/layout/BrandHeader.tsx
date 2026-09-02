import React from 'react';
import Image from 'next/image';

interface BrandHeaderProps {
  terminalLabel: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ terminalLabel }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#234D42] text-white border-b border-[#1b3d34] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Premier Green Innovations Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white leading-tight">
                Premier Green Innovations
              </span>
              <span className="text-[10px] text-[#AAB6AE] font-medium tracking-wide flex items-center gap-1.5 leading-none mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
                Spirit of Green • Operations Hub
              </span>
            </div>
          </div>

          {/* Sleek Terminal Badge */}
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-xs shadow-2xs">
            {terminalLabel}
          </span>
        </div>
      </div>
    </header>
  );
};
