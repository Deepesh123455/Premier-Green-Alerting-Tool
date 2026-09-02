'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Truck, PackagePlus, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
  { href: '/entry-exit', label: 'Entry / Exit', icon: ShieldCheck },
  { href: '/truck-log', label: 'Truck Log', icon: Truck },
  { href: '/incoming-report', label: 'Incoming Report', icon: PackagePlus },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#234D42] text-white border-b border-[#1b3d34] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
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
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-white/20 text-white shadow-xs'
                      : 'text-[#AAB6AE] hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
