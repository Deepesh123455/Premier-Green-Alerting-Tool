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
      <div className="bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-[#234D42]/40 rounded-2xl p-5 shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71817E]">
                Entry / Exit Log
              </span>
              <p className="text-sm font-bold text-[#1a2522]">{details.visitorName}</p>
            </div>
          </div>
          <div className="text-right text-xs text-[#71817E] flex items-center gap-1.5 bg-[#f8faf9] px-2.5 py-1 rounded-lg border border-[#e2e8e5]">
            <Clock className="w-3.5 h-3.5 text-[#71817E]" />
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Person to Meet</span>
            <span className="text-[#1a2522] font-semibold">{details.personToMeet || '—'}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Purpose</span>
            <span className="text-[#1a2522] font-semibold">{details.purpose || '—'}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Scheduled Visit</span>
            <span className="text-[#1a2522] font-semibold">
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
      <div className="bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-[#234D42]/40 rounded-2xl p-5 shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
              <Truck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71817E]">
                Truck Log
              </span>
              <p className="text-sm font-bold text-[#1a2522]">{details.vehicleNumber}</p>
            </div>
          </div>
          <div className="text-right text-xs text-[#71817E] flex items-center gap-1.5 bg-[#f8faf9] px-2.5 py-1 rounded-lg border border-[#e2e8e5]">
            <Clock className="w-3.5 h-3.5 text-[#71817E]" />
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Driver</span>
            <span className="text-[#1a2522] font-semibold">{details.driverName}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Material</span>
            <span className="text-[#234D42] font-bold">{details.material}</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Quantity</span>
            <span className="text-[#1a2522] font-semibold">{details.quantity} MT</span>
          </div>
          <div>
            <span className="text-[#71817E] block text-[11px] font-medium">Rate</span>
            <span className="text-[#1a2522] font-semibold">${details.rate}</span>
          </div>
          <div className="bg-[#e9f2ef] p-2 rounded-xl border border-[#234D42]/15">
            <span className="text-[#234D42] block text-[10px] font-bold uppercase">Total Cost</span>
            <span className="text-[#234D42] font-extrabold text-xs">₹ / $ {computedTotal}</span>
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
    <div className="bg-white hover:bg-[#fcfdfd] border border-[#e2e8e5] hover:border-amber-500/40 rounded-2xl p-5 shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between gap-2 border-b border-[#eef2f0] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <PackagePlus className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#71817E]">
              Incoming Report
            </span>
            <p className="text-sm font-bold text-[#1a2522]">{details.material}</p>
          </div>
        </div>
        <div className="text-right text-xs text-[#71817E] flex items-center gap-1.5 bg-[#f8faf9] px-2.5 py-1 rounded-lg border border-[#e2e8e5]">
          <Clock className="w-3.5 h-3.5 text-[#71817E]" />
          <span className="font-medium">{formattedTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-[#71817E] block text-[11px] font-medium">Vendor</span>
          <span className="text-amber-800 font-bold">{details.vendorName}</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[11px] font-medium">Trader Company</span>
          <span className="text-[#1a2522] font-semibold">{details.tradersCompany || '—'}</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[11px] font-medium">Quantity</span>
          <span className="text-[#1a2522] font-semibold">{details.quantity} MT</span>
        </div>
        <div>
          <span className="text-[#71817E] block text-[11px] font-medium">Price</span>
          <span className="text-[#1a2522] font-semibold">${details.price}</span>
        </div>
        <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
          <span className="text-amber-800 block text-[10px] font-bold uppercase">Total Value</span>
          <span className="text-amber-900 font-extrabold text-xs">₹ / $ {computedTotal}</span>
        </div>
      </div>
    </div>
  );
};
