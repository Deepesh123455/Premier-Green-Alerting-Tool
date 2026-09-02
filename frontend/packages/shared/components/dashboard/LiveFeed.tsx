'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Radio, Loader2, Inbox, Filter } from 'lucide-react';
import clsx from 'clsx';
import { useLiveEvents } from '../../hooks/useLiveEvents';
import { EventCard } from './EventCard';

type EventFilter = 'all' | 'entry_exit' | 'truck_log' | 'incoming_report';

export const LiveFeed: React.FC = () => {
  const { data: events, isLoading, error } = useLiveEvents();
  const [filter, setFilter] = useState<EventFilter>('all');

  const totalCount = events?.length || 0;
  const entryExitCount = events?.filter((e) => e.type === 'entry_exit').length || 0;
  const truckLogCount = events?.filter((e) => e.type === 'truck_log').length || 0;
  const incomingCount = events?.filter((e) => e.type === 'incoming_report').length || 0;

  const filteredEvents = events?.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleFilterClick = (selected: EventFilter) => {
    setFilter(selected);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5 bg-white border border-[#e2e8e5] p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl shadow-[#71817E]/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Premier Green Innovations Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-bold text-[#1a2522] tracking-tight">
                Operations Live Stream
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/30 animate-pulse">
                <Radio className="w-3 h-3" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#71817E] mt-0.5">
              Click any KPI tab below to filter live stream by category
            </p>
          </div>
        </div>

        {/* Interactive Clickable KPI Filter Buttons */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-xs w-full md:w-auto">
          {/* Total KPI Button */}
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            className={clsx(
              'px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center',
              filter === 'all'
                ? 'bg-[#234D42] text-white border-[#234D42] shadow-sm ring-2 ring-[#234D42]/20'
                : 'bg-[#f8faf9] text-[#50635e] border-[#e2e8e5] hover:bg-[#e9f2ef] hover:border-[#234D42]/30'
            )}
            title="Show All Operational Records"
          >
            <span
              className={clsx(
                'block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider',
                filter === 'all' ? 'text-white/80' : 'text-[#71817E]'
              )}
            >
              Total
            </span>
            <span className="text-sm sm:text-base font-extrabold leading-tight">{totalCount}</span>
          </button>

          {/* Visitors KPI Button */}
          <button
            type="button"
            onClick={() => handleFilterClick('entry_exit')}
            className={clsx(
              'px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center',
              filter === 'entry_exit'
                ? 'bg-[#234D42] text-white border-[#234D42] shadow-sm ring-2 ring-[#234D42]/20'
                : 'bg-[#f8faf9] text-[#50635e] border-[#e2e8e5] hover:bg-[#e9f2ef] hover:border-[#234D42]/30'
            )}
            title="Filter by Visitor Entry/Exit Logs"
          >
            <span
              className={clsx(
                'block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider',
                filter === 'entry_exit' ? 'text-white/80' : 'text-[#71817E]'
              )}
            >
              Visitors
            </span>
            <span className="text-sm sm:text-base font-extrabold leading-tight">{entryExitCount}</span>
          </button>

          {/* Trucks KPI Button */}
          <button
            type="button"
            onClick={() => handleFilterClick('truck_log')}
            className={clsx(
              'px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center',
              filter === 'truck_log'
                ? 'bg-[#234D42] text-white border-[#234D42] shadow-sm ring-2 ring-[#234D42]/20'
                : 'bg-[#f8faf9] text-[#50635e] border-[#e2e8e5] hover:bg-[#e9f2ef] hover:border-[#234D42]/30'
            )}
            title="Filter by Weighbridge Truck Logs"
          >
            <span
              className={clsx(
                'block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider',
                filter === 'truck_log' ? 'text-white/80' : 'text-[#71817E]'
              )}
            >
              Trucks
            </span>
            <span className="text-sm sm:text-base font-extrabold leading-tight">{truckLogCount}</span>
          </button>

          {/* Inward KPI Button */}
          <button
            type="button"
            onClick={() => handleFilterClick('incoming_report')}
            className={clsx(
              'px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-center transition-all duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center',
              filter === 'incoming_report'
                ? 'bg-[#234D42] text-white border-[#234D42] shadow-sm ring-2 ring-[#234D42]/20'
                : 'bg-[#f8faf9] text-[#50635e] border-[#e2e8e5] hover:bg-[#e9f2ef] hover:border-[#234D42]/30'
            )}
            title="Filter by Warehouse Incoming Reports"
          >
            <span
              className={clsx(
                'block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider',
                filter === 'incoming_report' ? 'text-white/80' : 'text-[#71817E]'
              )}
            >
              Inward
            </span>
            <span className="text-sm sm:text-base font-extrabold leading-tight">{incomingCount}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white border border-[#e2e8e5] rounded-2xl sm:rounded-3xl shadow-xs">
          <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#234D42] animate-spin mb-3" />
          <p className="text-xs sm:text-sm font-medium text-[#71817E]">Loading real-time operational records...</p>
        </div>
      )}

      {error && (
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          Failed to load live events: {(error as Error).message}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEvents?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white border border-[#e2e8e5] rounded-2xl sm:rounded-3xl shadow-xs text-center px-4 animate-pop-in">
          <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-[#AAB6AE] mb-3" />
          <h3 className="text-sm sm:text-base font-bold text-[#1a2522]">
            {filter === 'all'
              ? 'Awaiting First Operational Submission'
              : `No ${filter === 'entry_exit' ? 'Visitor' : filter === 'truck_log' ? 'Truck' : 'Inward'} records found`}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#71817E] mt-1 max-w-md">
            {filter === 'all'
              ? 'Submissions from Gate, Weighbridge & Warehouse terminals will appear live instantly.'
              : 'Click "Total" to view all records across other operational departments.'}
          </p>
          {filter !== 'all' && (
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="mt-3.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#e9f2ef] hover:bg-[#d8e8e3] text-[#234D42] border border-[#d2ded8] transition-all cursor-pointer"
            >
              Reset to All Records
            </button>
          )}
        </div>
      )}

      {/* Filtered Event Cards Stream */}
      <div className="space-y-3 sm:space-y-3.5">
        {filteredEvents?.map((item) => (
          <EventCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};
