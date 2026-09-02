import React from 'react';
import { ShieldCheck, Truck, PackagePlus, Clock } from 'lucide-react';
import { LiveFeedItem } from '../../types/event';

interface EventCardProps {
  item: LiveFeedItem;
}

export const EventCard: React.FC<EventCardProps> = ({ item }) => {
  const { type, created_at, details } = item;

  const formattedTime = new Date(created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (type === 'entry_exit') {
    return (
      <div className="animate-slide-down bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-[#234D42]/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
        <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71817E] block">
                Entry / Exit Log
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1a2522] truncate">{details.visitorName}</p>
            </div>
          </div>
          <div className="text-right text-[11px] sm:text-xs text-[#71817E] flex items-center gap-1 sm:gap-1.5 bg-[#f8faf9] px-2 sm:px-2.5 py-1 rounded-lg border border-[#e2e8e5] shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71817E]" />
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Person to Meet</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.personToMeet || '—'}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Purpose</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.purpose || '—'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Scheduled Visit</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">
              {details.visitDate} at {details.visitTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'truck_log') {
    const qty = Number(details.quantity) || 0;
    const rate = Number(details.rate) || 0;
    const computedTotal = (qty * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <div className="animate-slide-down bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-[#234D42]/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
        <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8] shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71817E] block">
                Truck Log
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1a2522] truncate">{details.vehicleNumber}</p>
            </div>
          </div>
          <div className="text-right text-[11px] sm:text-xs text-[#71817E] flex items-center gap-1 sm:gap-1.5 bg-[#f8faf9] px-2 sm:px-2.5 py-1 rounded-lg border border-[#e2e8e5] shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71817E]" />
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-xs">
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Driver</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.driverName}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Material</span>
            <span className="text-[#234D42] font-bold text-xs sm:text-sm">{details.material}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Quantity</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.quantity} {details.quantityUnit || 'MT'}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Rate</span>
            <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">${details.rate}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-[#f8faf9] p-2 rounded-xl border border-[#d2ded8]">
            <span className="text-[#71817E] block text-[9px] sm:text-[10px] font-bold uppercase">Total Cost</span>
            <span className="text-[#234D42] font-extrabold text-xs sm:text-sm">₹ / $ {computedTotal}</span>
          </div>
        </div>
      </div>
    );
  }

  // incoming_report
  const qty = Number(details.quantity) || 0;
  const price = Number(details.price) || 0;
  const computedTotal = (qty * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="animate-slide-down bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-[#234D42]/40 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out">
      <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="p-1.5 sm:p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8] shrink-0">
            <PackagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#71817E] block">
              Incoming Report
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#1a2522] truncate">{details.material}</p>
          </div>
        </div>
        <div className="text-right text-[11px] sm:text-xs text-[#71817E] flex items-center gap-1 sm:gap-1.5 bg-[#f8faf9] px-2 sm:px-2.5 py-1 rounded-lg border border-[#e2e8e5] shrink-0">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#71817E]" />
          <span className="font-medium">{formattedTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-xs">
        <div>
          <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Vendor</span>
          <span className="text-[#1a2522] font-bold text-xs sm:text-sm">{details.vendorName}</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Trader Company</span>
          <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.tradersCompany || '—'}</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Quantity</span>
          <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">{details.quantity} {details.quantityUnit || 'MT'}</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[10px] sm:text-[11px] font-medium">Price</span>
          <span className="text-[#1a2522] font-semibold text-xs sm:text-sm">${details.price}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-[#f8faf9] p-2 rounded-xl border border-[#d2ded8]">
          <span className="text-[#71817E] block text-[9px] sm:text-[10px] font-bold uppercase">Total Value</span>
          <span className="text-[#234D42] font-extrabold text-xs sm:text-sm">₹ / $ {computedTotal}</span>
        </div>
      </div>
    </div>
  );
};
