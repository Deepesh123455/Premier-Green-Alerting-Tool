'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import clsx from 'clsx';

interface PremiumClockPickerProps {
  label: string;
  value: string; // HH:mm (24-hour format)
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

export const PremiumClockPicker: React.FC<PremiumClockPickerProps> = ({
  label,
  value,
  onChange,
  required,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);

  // Parse 24-hr value into 12-hr format
  const parse24To12 = (val24: string) => {
    if (!val24) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      return {
        h12Str: String(h % 12 === 0 ? 12 : h % 12).padStart(2, '0'),
        minStr: String(m).padStart(2, '0'),
        ampm: h >= 12 ? ('PM' as const) : ('AM' as const),
      };
    }
    const [hStr, mStr] = val24.split(':');
    const h24 = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);
    return {
      h12Str: String(h24 % 12 === 0 ? 12 : h24 % 12).padStart(2, '0'),
      minStr: String(m).padStart(2, '0'),
      ampm: h24 >= 12 ? ('PM' as const) : ('AM' as const),
    };
  };

  const parsed = parse24To12(value);
  const [inputHour, setInputHour] = useState(parsed.h12Str);
  const [inputMinute, setInputMinute] = useState(parsed.minStr);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(parsed.ampm);

  useEffect(() => {
    const updated = parse24To12(value);
    setInputHour(updated.h12Str);
    setInputMinute(updated.minStr);
    setAmpm(updated.ampm);
  }, [value]);

  // Convert 12-hr to 24-hr string and broadcast
  const syncTime = (hStr: string, mStr: string, period: 'AM' | 'PM') => {
    let h12 = parseInt(hStr || '12', 10);
    if (isNaN(h12) || h12 < 1) h12 = 12;
    if (h12 > 12) h12 = 12;

    let m = parseInt(mStr || '0', 10);
    if (isNaN(m) || m < 0) m = 0;
    if (m > 59) m = 59;

    let h24 = h12;
    if (period === 'PM' && h12 < 12) h24 += 12;
    if (period === 'AM' && h12 === 12) h24 = 0;

    const formatted24 = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(formatted24);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle Hour typing
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setInputHour(raw);

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      syncTime(raw, inputMinute, ampm);
      if (raw.length === 2 || num > 1) {
        minuteInputRef.current?.focus();
      }
    }
  };

  const handleHourBlur = () => {
    let num = parseInt(inputHour, 10);
    if (isNaN(num) || num < 1) num = 12;
    if (num > 12) num = 12;
    const padded = String(num).padStart(2, '0');
    setInputHour(padded);
    syncTime(padded, inputMinute, ampm);
  };

  // Handle Minute typing
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setInputMinute(raw);

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 59) {
      syncTime(inputHour, raw, ampm);
    }
  };

  const handleMinuteBlur = () => {
    let num = parseInt(inputMinute, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > 59) num = 59;
    const padded = String(num).padStart(2, '0');
    setInputMinute(padded);
    syncTime(inputHour, padded, ampm);
  };

  const handleToggleAmpm = (period: 'AM' | 'PM') => {
    setAmpm(period);
    syncTime(inputHour, inputMinute, period);
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const newAmpm = h >= 12 ? 'PM' : 'AM';
    const newH12 = String(h % 12 === 0 ? 12 : h % 12).padStart(2, '0');
    const newM = String(m).padStart(2, '0');

    setInputHour(newH12);
    setInputMinute(newM);
    setAmpm(newAmpm);
    syncTime(newH12, newM, newAmpm);
  };

  const handleQuickPreset = (h: number, m: number, period: 'AM' | 'PM') => {
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    setInputHour(hStr);
    setInputMinute(mStr);
    setAmpm(period);
    syncTime(hStr, mStr, period);
  };

  // Format readable display: e.g. "05:25 PM"
  const formattedDisplay = `${inputHour || '12'}:${inputMinute || '00'} ${ampm}`;

  return (
    <div ref={containerRef} className="relative w-full flex flex-col space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[#354541] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#234D42]">*</span>}
        </span>
        <span className="text-[10px] text-[#71817E] font-medium lowercase">IST</span>
      </label>

      {/* Main Input Display Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => hourInputRef.current?.focus(), 50);
        }}
        className={clsx(
          'w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white text-left border rounded-xl text-sm transition-all duration-200 ease-out flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99]',
          isOpen
            ? 'border-[#234D42] ring-2 ring-[#234D42]/20'
            : error
            ? 'border-rose-500'
            : 'border-[#d2ded8] hover:border-[#AAB6AE]'
        )}
      >
        <span className="font-semibold text-xs sm:text-sm text-[#1a2522] tracking-wide truncate">
          {formattedDisplay}
        </span>
        <Clock className="w-4 h-4 text-[#234D42] shrink-0 ml-2" />
      </button>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {/* Sleek Manual Typing Digital Time Picker (Opens Below Input) */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 z-50 mt-2 w-[calc(100vw-2.5rem)] max-w-[280px] bg-white border border-[#d2ded8] rounded-2xl shadow-xl p-4 animate-pop-in">
          <div className="text-center mb-2.5">
            <span className="text-[10px] font-semibold text-[#71817E] uppercase tracking-wider">
              Type Time Manually
            </span>
          </div>

          {/* Digital Typing Inputs Container */}
          <div className="flex items-center justify-between bg-[#f8faf9] border border-[#d2ded8] p-2.5 rounded-xl mb-3">
            {/* Hour & Minute Manual Inputs */}
            <div className="flex items-center gap-1.5 font-mono">
              {/* Hour Input Box */}
              <div className="flex flex-col items-center">
                <input
                  ref={hourInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={inputHour}
                  onChange={handleHourChange}
                  onBlur={handleHourBlur}
                  placeholder="12"
                  className="w-11 h-10 text-center text-lg font-bold text-[#1a2522] bg-white border border-[#d2ded8] focus:border-[#234D42] focus:ring-2 focus:ring-[#234D42]/20 rounded-lg outline-none transition-all"
                />
                <span className="text-[9px] text-[#71817E] font-sans font-medium mt-0.5">HH</span>
              </div>

              <span className="text-lg font-bold text-[#71817E] pb-3">:</span>

              {/* Minute Input Box */}
              <div className="flex flex-col items-center">
                <input
                  ref={minuteInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={inputMinute}
                  onChange={handleMinuteChange}
                  onBlur={handleMinuteBlur}
                  placeholder="00"
                  className="w-11 h-10 text-center text-lg font-bold text-[#1a2522] bg-white border border-[#d2ded8] focus:border-[#234D42] focus:ring-2 focus:ring-[#234D42]/20 rounded-lg outline-none transition-all"
                />
                <span className="text-[9px] text-[#71817E] font-sans font-medium mt-0.5">MM</span>
              </div>
            </div>

            {/* AM / PM Switcher Pill */}
            <div className="flex flex-col gap-1 bg-[#e9f2ef] p-1 rounded-xl border border-[#d2ded8] text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleAmpm('AM')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer text-center text-[11px]',
                  ampm === 'AM'
                    ? 'bg-[#234D42] text-white shadow-2xs font-extrabold'
                    : 'text-[#50635e] hover:text-[#1a2522]'
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmpm('PM')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer text-center text-[11px]',
                  ampm === 'PM'
                    ? 'bg-[#234D42] text-white shadow-2xs font-extrabold'
                    : 'text-[#50635e] hover:text-[#1a2522]'
                )}
              >
                PM
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mb-3">
            <span className="text-[9px] font-medium text-[#71817E] uppercase tracking-wider block mb-1.5">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickPreset(9, 0, 'AM')}
                className="py-1 px-1.5 rounded-lg bg-[#f8faf9] hover:bg-[#e9f2ef] border border-[#e2e8e5] text-[#50635e] font-medium transition-colors"
              >
                09:00 AM
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(12, 0, 'PM')}
                className="py-1 px-1.5 rounded-lg bg-[#f8faf9] hover:bg-[#e9f2ef] border border-[#e2e8e5] text-[#50635e] font-medium transition-colors"
              >
                12:00 PM
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(3, 30, 'PM')}
                className="py-1 px-1.5 rounded-lg bg-[#f8faf9] hover:bg-[#e9f2ef] border border-[#e2e8e5] text-[#50635e] font-medium transition-colors"
              >
                03:30 PM
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-[#f0f4f2] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="font-semibold text-[#234D42] hover:underline cursor-pointer text-[11px]"
            >
              Current Time
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 font-semibold bg-[#234D42] text-white px-3 py-1.5 rounded-xl shadow-2xs hover:bg-[#1a3b32] transition-all duration-150 active:scale-95 cursor-pointer text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
