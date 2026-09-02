'use client';

import React from 'react';
import Image from 'next/image';
import { Radio, Loader2, Inbox } from 'lucide-react';
import { useLiveEvents } from '../../hooks/useLiveEvents';
import { EventCard } from './EventCard';

export const LiveFeed: React.FC = () => {
  const { data: events, isLoading, error } = useLiveEvents();

  const entryExitCount = events?.filter((e) => e.type === 'entry_exit').length || 0;
  const truckLogCount = events?.filter((e) => e.type === 'truck_log').length || 0;
  const incomingCount = events?.filter((e) => e.type === 'incoming_report').length || 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white border border-[#e2e8e5] p-6 sm:p-7 rounded-3xl shadow-xl shadow-[#71817E]/5">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Premier Green Innovations Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a2522] tracking-tight">
                Operations Live Stream
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/30 animate-pulse">
                <Radio className="w-3 h-3" />
                ACTIVE FEED
              </span>
            </div>
            <p className="text-xs text-[#71817E] mt-0.5">
              Persistent & real-time alerts from Security Gate, Weighbridge & Warehouse
            </p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-[#f8faf9] border border-[#e2e8e5] text-center min-w-[70px]">
            <span className="text-[#71817E] block text-[10px] uppercase font-bold">Total</span>
            <span className="text-base font-extrabold text-[#1a2522]">{events?.length || 0}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-[#e9f2ef] border border-[#234D42]/20 text-center min-w-[70px]">
            <span className="text-[#234D42] block text-[10px] uppercase font-bold">Visitors</span>
            <span className="text-base font-extrabold text-[#234D42]">{entryExitCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-[#f1f5f3] border border-[#d2ded8] text-center min-w-[70px]">
            <span className="text-[#71817E] block text-[10px] uppercase font-bold">Trucks</span>
            <span className="text-base font-extrabold text-[#354541]">{truckLogCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[70px]">
            <span className="text-amber-700 block text-[10px] uppercase font-bold">Inward</span>
            <span className="text-base font-extrabold text-amber-800">{incomingCount}</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e2e8e5] rounded-3xl shadow-xs">
          <Loader2 className="w-8 h-8 text-[#234D42] animate-spin mb-3" />
          <p className="text-sm font-medium text-[#71817E]">Loading real-time operational records...</p>
        </div>
      )}

      {error && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          Failed to load live events: {(error as Error).message}
        </div>
      )}

      {!isLoading && !error && events?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e2e8e5] rounded-3xl shadow-xs text-center px-4">
          <Inbox className="w-12 h-12 text-[#AAB6AE] mb-3" />
          <h3 className="text-base font-bold text-[#1a2522]">Awaiting First Operational Submission</h3>
          <p className="text-xs text-[#71817E] mt-1 max-w-md">
            All submissions from Entry/Exit, Truck Log, and Incoming Report terminals persist permanently and update live without refresh.
          </p>
        </div>
      )}

      <div className="space-y-3.5">
        {events?.map((item) => (
          <EventCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};
