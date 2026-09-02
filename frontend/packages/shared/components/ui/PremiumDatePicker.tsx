'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PremiumDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const PremiumDatePicker: React.FC<PremiumDatePickerProps> = ({
  label,
  value,
  onChange,
  required,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize selected date
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

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

  const formatDateYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDateYMD(new Date());

  // Format nice display: e.g. "02 Sep 2026"
  const formattedDisplay = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Select date';

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(formatDateYMD(d));
    setIsOpen(false);
  };

  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onChange(todayStr);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[#354541] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#234D42]">*</span>}
        </span>
      </label>

      {/* Input Field Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full px-4 py-3 bg-white text-left border rounded-xl text-sm transition-all duration-200 ease-out flex items-center justify-between shadow-xs cursor-pointer active:scale-[0.99]',
          isOpen
            ? 'border-[#234D42] ring-2 ring-[#234D42]/20'
            : error
            ? 'border-rose-500'
            : 'border-[#d2ded8] hover:border-[#AAB6AE]'
        )}
      >
        <span className={clsx('font-medium', value ? 'text-[#1a2522]' : 'text-[#AAB6AE]')}>
          {formattedDisplay}
        </span>
        <CalendarIcon className="w-4 h-4 text-[#234D42]" />
      </button>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {/* Floating Modern Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-72 bg-white border border-[#d2ded8] rounded-2xl shadow-xl p-4 animate-pop-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm text-[#1a2522]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-[#e9f2ef] text-[#234D42] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-[#e9f2ef] text-[#234D42] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#71817E] mb-1.5">
            {WEEKDAYS.map((wd) => (
              <span key={wd}>{wd}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const thisDateStr = formatDateYMD(new Date(viewYear, viewMonth, day));
              const isSelected = value === thisDateStr;
              const isToday = thisDateStr === todayStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={clsx(
                    'h-8 w-8 mx-auto rounded-full font-bold flex items-center justify-center transition-all duration-150 ease-out text-xs cursor-pointer',
                    isSelected
                      ? 'bg-[#234D42] text-white shadow-xs'
                      : isToday
                      ? 'border border-[#234D42] text-[#234D42] font-extrabold'
                      : 'hover:bg-[#e9f2ef] text-[#1a2522]'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="mt-3 pt-2.5 border-t border-[#eef2f0] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSetToday}
              className="font-bold text-[#234D42] hover:underline cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-[#71817E] hover:text-[#1a2522] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
