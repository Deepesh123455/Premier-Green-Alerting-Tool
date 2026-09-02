'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  PackagePlus,
  LayoutDashboard,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
} from 'lucide-react';

interface LinkCard {
  title: string;
  role: string;
  device: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  iconStyle: string;
  badgeStyle: string;
  accentBorder: string;
}

const cards: LinkCard[] = [
  {
    title: 'Live Operations Stream',
    role: 'Central Display / Laptop',
    device: 'Large Screen / Monitor',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Hub 0: Command Center',
    description:
      'Real-time WebSocket dashboard. Displays all live logs with instant zero-refresh sync across all facilities.',
    iconStyle: 'bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20',
    badgeStyle: 'bg-[#e9f2ef] text-[#234D42] border-[#234D42]/30',
    accentBorder: 'border-[#d2ded8] hover:border-[#234D42]',
  },
  {
    title: 'Gate Entry / Exit Log',
    role: 'Security & Reception',
    device: 'Mobile Phone 1',
    href: '/entry-exit',
    icon: ShieldCheck,
    badge: 'Terminal 1',
    description:
      'Fast visitor logging: captures visitor name, visit time, purpose, and host contact at the gate.',
    iconStyle: 'bg-[#f1f5f3] text-[#234D42] border border-[#d2ded8]',
    badgeStyle: 'bg-[#f1f5f3] text-[#234D42] border-[#d2ded8]',
    accentBorder: 'border-[#e2e8e5] hover:border-[#234D42]',
  },
  {
    title: 'Weighbridge & Truck Log',
    role: 'Transport / Gate Operator',
    device: 'Mobile Phone 2',
    href: '/truck-log',
    icon: Truck,
    badge: 'Terminal 2',
    description:
      'Logs vehicle registration, driver details, dispatched materials, tonnage, rate, and computed total.',
    iconStyle: 'bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]',
    badgeStyle: 'bg-[#e9f2ef] text-[#234D42] border-[#d2ded8]',
    accentBorder: 'border-[#e2e8e5] hover:border-[#234D42]',
  },
  {
    title: 'Warehouse Incoming Report',
    role: 'Inventory / Stock Manager',
    device: 'Mobile Phone 3',
    href: '/incoming-report',
    icon: PackagePlus,
    badge: 'Terminal 3',
    description:
      'Logs incoming stock, material name, vendor details, trader company, quantity, price, and total value.',
    iconStyle: 'bg-amber-50 text-amber-700 border border-amber-200',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    accentBorder: 'border-[#e2e8e5] hover:border-amber-400',
  },
];

export default function HomePage() {
  const [copiedHref, setCopiedHref] = useState<string | null>(null);

  const handleCopy = (href: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${href}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedHref(href);
      setTimeout(() => setCopiedHref(null), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Brand Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d2ded8] text-xs font-semibold text-[#234D42] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#234D42]" />
          <span>Premier Green Innovations • Real-Time Alerting System</span>
        </div>

        <div className="flex justify-center my-3">
          <div className="w-20 h-20 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Premier Green Innovations Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1a2522] tracking-tight leading-tight">
          Operations Control & Dedicated Mobile Endpoints
        </h1>
        <p className="text-sm sm:text-base text-[#50635e] leading-relaxed">
          Display the <strong>Live Dashboard</strong> on a main screen, and open the 3 form links on separate mobile phones. Every submission instantly updates the central dashboard live.
        </p>
      </div>

      {/* 4 Dedicated Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isCopied = copiedHref === card.href;

          return (
            <div
              key={card.href}
              className={`p-6 sm:p-7 rounded-3xl bg-white border ${card.accentBorder} shadow-lg shadow-[#71817E]/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className={`p-3.5 rounded-2xl ${card.iconStyle}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#71817E]">
                    {card.href === '/dashboard' ? (
                      <Monitor className="w-3.5 h-3.5 text-[#234D42]" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5 text-[#71817E]" />
                    )}
                    <span>{card.device} • {card.role}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#1a2522] tracking-tight">
                    {card.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#50635e] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-[#eef2f0] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(card.href)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f8faf9] hover:bg-[#f1f5f3] text-[#354541] border border-[#d2ded8] transition-all"
                  title="Copy direct phone link"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#234D42]" />
                      <span className="text-[#234D42] font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#234D42] hover:bg-[#1a3b32] text-white shadow-sm transition-all"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
