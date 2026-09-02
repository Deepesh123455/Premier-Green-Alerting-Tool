'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
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
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse 24-hr value into 12-hr format
  const parse24To12 = (val24: string) => {
    if (!val24) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      return {
        h12: h % 12 === 0 ? 12 : h % 12,
        minutes: m,
        ampm: h >= 12 ? ('PM' as const) : ('AM' as const),
      };
    }
    const [hStr, mStr] = val24.split(':');
    const h24 = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);
    return {
      h12: h24 % 12 === 0 ? 12 : h24 % 12,
      minutes: m,
      ampm: h24 >= 12 ? ('PM' as const) : ('AM' as const),
    };
  };

  const parsed = parse24To12(value);
  const [selectedHour, setSelectedHour] = useState(parsed.h12);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minutes);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(parsed.ampm);

  useEffect(() => {
    const updated = parse24To12(value);
    setSelectedHour(updated.h12);
    setSelectedMinute(updated.minutes);
    setAmpm(updated.ampm);
  }, [value]);

  // Convert 12-hr back to 24-hr string
  const get24HourString = (h12: number, m: number, period: 'AM' | 'PM') => {
    let h24 = h12;
    if (period === 'PM' && h12 < 12) h24 += 12;
    if (period === 'AM' && h12 === 12) h24 = 0;
    const hStr = String(h24).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    return `${hStr}:${mStr}`;
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

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    const new24 = get24HourString(h, selectedMinute, ampm);
    onChange(new24);
    // Smooth transition to minutes selection
    setMode('minutes');
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
    const new24 = get24HourString(selectedHour, m, ampm);
    onChange(new24);
  };

  const handleToggleAmpm = (period: 'AM' | 'PM') => {
    setAmpm(period);
    const new24 = get24HourString(selectedHour, selectedMinute, period);
    onChange(new24);
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const newAmpm = h >= 12 ? 'PM' : 'AM';
    const newH12 = h % 12 === 0 ? 12 : h % 12;
    setSelectedHour(newH12);
    setSelectedMinute(m);
    setAmpm(newAmpm);
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    onChange(`${hStr}:${mStr}`);
  };

  // Format readable display: e.g. "01:25 PM"
  const formattedDisplay = `${String(selectedHour).padStart(2, '0')}:${String(
    selectedMinute
  ).padStart(2, '0')} ${ampm}`;

  // Clock geometry
  const radius = 80;
  const centerX = 105;
  const centerY = 105;

  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Calculate hand pointer angle
  const activeAngle =
    mode === 'hours'
      ? (selectedHour % 12) * 30 // 360 / 12 = 30 deg
      : selectedMinute * 6; // 360 / 60 = 6 deg

  return (
    <div ref={containerRef} className="relative w-full flex flex-col space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[#354541] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#234D42]">*</span>}
        </span>
        <span className="text-[10px] text-[#71817E] font-medium lowercase">indian standard time</span>
      </label>

      {/* Input Field Box */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setMode('hours');
        }}
        className={clsx(
          'w-full px-4 py-3 bg-white text-left border rounded-xl text-sm transition-all duration-200 ease-out flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99]',
          isOpen
            ? 'border-[#234D42] ring-2 ring-[#234D42]/20'
            : error
            ? 'border-rose-500'
            : 'border-[#d2ded8] hover:border-[#AAB6AE]'
        )}
      >
        <span className="font-semibold text-[#1a2522] tracking-wide">
          {formattedDisplay}
        </span>
        <Clock className="w-4 h-4 text-[#234D42]" />
      </button>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {/* Floating Radial Clock Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-72 bg-white border border-[#d2ded8] rounded-3xl shadow-2xl p-5 animate-pop-in">
          {/* Time Digital Banner & AM/PM Switcher */}
          <div className="flex items-center justify-between bg-[#f8faf9] border border-[#e2e8e5] p-3 rounded-2xl mb-4">
            <div className="flex items-center gap-1 font-mono text-xl font-black text-[#1a2522]">
              <button
                type="button"
                onClick={() => setMode('hours')}
                className={clsx(
                  'px-2 py-1 rounded-xl transition-all duration-150 cursor-pointer',
                  mode === 'hours'
                    ? 'bg-[#234D42] text-white shadow-xs'
                    : 'text-[#50635e] hover:bg-[#e9f2ef]'
                )}
              >
                {String(selectedHour).padStart(2, '0')}
              </button>
              <span className="text-[#71817E]">:</span>
              <button
                type="button"
                onClick={() => setMode('minutes')}
                className={clsx(
                  'px-2 py-1 rounded-xl transition-all duration-150 cursor-pointer',
                  mode === 'minutes'
                    ? 'bg-[#234D42] text-white shadow-xs'
                    : 'text-[#50635e] hover:bg-[#e9f2ef]'
                )}
              >
                {String(selectedMinute).padStart(2, '0')}
              </button>
            </div>

            {/* AM / PM Toggle */}
            <div className="flex items-center bg-[#e9f2ef] p-1 rounded-xl border border-[#d2ded8] text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleAmpm('AM')}
                className={clsx(
                  'px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer',
                  ampm === 'AM' ? 'bg-[#234D42] text-white shadow-xs' : 'text-[#50635e]'
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmpm('PM')}
                className={clsx(
                  'px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer',
                  ampm === 'PM' ? 'bg-[#234D42] text-white shadow-xs' : 'text-[#50635e]'
                )}
              >
                PM
              </button>
            </div>
          </div>

          {/* Mode Title */}
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold text-[#71817E] uppercase tracking-wider">
              {mode === 'hours' ? 'Select Hour' : 'Select Minute'}
            </span>
          </div>

          {/* Circular Radial Clock Face */}
          <div className="relative w-[210px] h-[210px] mx-auto bg-[#f8faf9] border border-[#d2ded8] rounded-full shadow-inner flex items-center justify-center select-none">
            {/* Center Pivot Point */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#234D42] z-20" />

            {/* Animated Smooth Clock Hand Pointer */}
            <div
              className="absolute w-1 bg-[#234D42] origin-bottom pointer-events-none z-10 transition-transform duration-300"
              style={{
                height: `${radius - 12}px`,
                bottom: '50%',
                left: 'calc(50% - 2px)',
                transform: `rotate(${activeAngle}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Hand Circle Tip */}
              <div className="w-7 h-7 rounded-full bg-[#234D42] absolute -top-3.5 -left-3 shadow-xs" />
            </div>

            {/* Hours Face (1 to 12) */}
            {mode === 'hours' &&
              hoursList.map((hour, index) => {
                const angle = index * 30 * (Math.PI / 180) - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle) - 14;
                const y = centerY + radius * Math.sin(angle) - 14;
                const isSelected = selectedHour === hour;

                return (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleSelectHour(hour)}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className={clsx(
                      'absolute w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-150 z-20 cursor-pointer',
                      isSelected
                        ? 'text-white font-black scale-110'
                        : 'text-[#1a2522] hover:bg-[#e9f2ef]'
                    )}
                  >
                    {hour}
                  </button>
                );
              })}

            {/* Minutes Face (00, 05, 10 ... 55) */}
            {mode === 'minutes' &&
              minutesList.map((minute, index) => {
                const angle = index * 30 * (Math.PI / 180) - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle) - 14;
                const y = centerY + radius * Math.sin(angle) - 14;
                const isSelected = Math.abs(selectedMinute - minute) < 2.5;

                return (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleSelectMinute(minute)}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className={clsx(
                      'absolute w-7 h-7 rounded-full font-bold text-[11px] font-mono flex items-center justify-center transition-all duration-150 z-20 cursor-pointer',
                      isSelected
                        ? 'text-white font-black scale-110'
                        : 'text-[#1a2522] hover:bg-[#e9f2ef]'
                    )}
                  >
                    {String(minute).padStart(2, '0')}
                  </button>
                );
              })}
          </div>

          {/* Quick Footer Action Buttons */}
          <div className="mt-4 pt-3 border-t border-[#eef2f0] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="font-bold text-[#234D42] hover:underline cursor-pointer"
            >
              Current Time
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold bg-[#234D42] text-white px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-[#1a3b32] transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
