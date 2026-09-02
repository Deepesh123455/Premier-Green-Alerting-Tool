'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plane, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

interface AirportDateTimePickerProps {
  dateValue: string; // YYYY-MM-DD
  timeValue: string; // HH:mm
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
}

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const DAY_NAMES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const AirportDateTimePicker: React.FC<AirportDateTimePickerProps> = ({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Parse current date or fallback to today
  const selectedDate = dateValue ? new Date(dateValue + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  // Parse time
  const [hours, setHours] = useState(() => {
    if (!timeValue) return '09';
    return timeValue.split(':')[0] || '09';
  });
  const [minutes, setMinutes] = useState(() => {
    if (!timeValue) return '00';
    return timeValue.split(':')[1] || '00';
  });

  useEffect(() => {
    if (timeValue) {
      const parts = timeValue.split(':');
      if (parts.length === 2) {
        setHours(parts[0]);
        setMinutes(parts[1]);
      }
    }
  }, [timeValue]);

  // Quick Date Helpers
  const formatDateToYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayYMD = formatDateToYMD(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowYMD = formatDateToYMD(tomorrow);

  const isToday = dateValue === todayYMD;
  const isTomorrow = dateValue === tomorrowYMD;

  // Format Display Strings
  const displayDayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const displayMonthName = selectedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const displayDayNum = String(selectedDate.getDate()).padStart(2, '0');
  const displayYear = selectedDate.getFullYear();

  // Time Formatter for 12-hour display
  const hourNum = parseInt(hours, 10) || 0;
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const display12Hour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const displayTimeFormatted = `${String(display12Hour).padStart(2, '0')}:${minutes} ${ampm}`;

  // Calendar Day Generation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const ymd = formatDateToYMD(d);
    onDateChange(ymd);
    setShowCalendar(false);
  };

  const updateTime = (newH: string, newM: string) => {
    setHours(newH);
    setMinutes(newM);
    onTimeChange(`${newH}:${newM}`);
  };

  const setNowTime = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    updateTime(h, m);
  };

  return (
    <div className="w-full space-y-2">
      {/* Boarding Pass Container */}
      <div className="relative rounded-3xl bg-[#f8faf9] border border-[#d2ded8] overflow-hidden shadow-sm transition-all duration-200 hover:border-[#234D42]/40">
        {/* Ticket Header Bar */}
        <div className="bg-[#234D42] text-white px-5 py-2.5 flex items-center justify-between text-xs font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-[#AAB6AE] rotate-45" />
            <span className="uppercase">Facility Arrival Pass • Gate Schedule</span>
          </div>
          <span className="text-[10px] text-[#AAB6AE] font-mono tracking-widest uppercase">
            PGI-GATE-01
          </span>
        </div>

        {/* Ticket Body: 2 Columns with Perforation Divider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-[#d2ded8] p-4 sm:p-5 gap-4 sm:gap-0">
          {/* Left Column: Flight-Style Date Picker */}
          <div className="sm:pr-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  Scheduled Arrival Date
                </span>
                <span className="text-[10px] font-bold text-[#234D42] bg-[#e9f2ef] px-2 py-0.5 rounded-md">
                  {displayDayName}
                </span>
              </div>

              {/* Big Airport Date Display Card */}
              <button
                type="button"
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowTimePicker(false);
                }}
                className="mt-2 w-full flex items-center justify-between bg-white hover:bg-[#edf7f3] border border-[#d2ded8] hover:border-[#234D42] p-3 rounded-2xl transition-all group text-left shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e9f2ef] text-[#234D42] flex items-center justify-center font-bold text-sm">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[#1a2522] tracking-tight group-hover:text-[#234D42]">
                      {displayDayNum} {displayMonthName}
                    </div>
                    <div className="text-xs text-[#71817E] font-medium">
                      {displayYear} • {displayDayName}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#234D42] bg-[#e9f2ef] px-2.5 py-1 rounded-lg">
                  Change
                </div>
              </button>
            </div>

            {/* Quick Date Pills */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onDateChange(todayYMD)}
                className={clsx(
                  'flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all text-center border',
                  isToday
                    ? 'bg-[#234D42] text-white border-[#234D42]'
                    : 'bg-white hover:bg-[#e9f2ef] text-[#50635e] border-[#d2ded8]'
                )}
              >
                TODAY
              </button>
              <button
                type="button"
                onClick={() => onDateChange(tomorrowYMD)}
                className={clsx(
                  'flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all text-center border',
                  isTomorrow
                    ? 'bg-[#234D42] text-white border-[#234D42]'
                    : 'bg-white hover:bg-[#e9f2ef] text-[#50635e] border-[#d2ded8]'
                )}
              >
                TOMORROW
              </button>
            </div>

            {dateError && <p className="text-xs text-rose-600 font-semibold">{dateError}</p>}
          </div>

          {/* Right Column: Boarding Time */}
          <div className="sm:pl-5 flex flex-col justify-between space-y-3 pt-3 sm:pt-0">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71817E]">
                  Check-in / Gate Time
                </span>
                <span className="text-[10px] font-bold text-[#234D42] bg-[#e9f2ef] px-2 py-0.5 rounded-md font-mono">
                  {hours}:{minutes} (24H)
                </span>
              </div>

              {/* Big Airport Time Display Card */}
              <button
                type="button"
                onClick={() => {
                  setShowTimePicker(!showTimePicker);
                  setShowCalendar(false);
                }}
                className="mt-2 w-full flex items-center justify-between bg-white hover:bg-[#edf7f3] border border-[#d2ded8] hover:border-[#234D42] p-3 rounded-2xl transition-all group text-left shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e9f2ef] text-[#234D42] flex items-center justify-center font-bold text-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[#1a2522] tracking-tight group-hover:text-[#234D42] font-mono">
                      {displayTimeFormatted}
                    </div>
                    <div className="text-xs text-[#71817E] font-medium">
                      24-HR FORMAT: {hours}:{minutes}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#234D42] bg-[#e9f2ef] px-2.5 py-1 rounded-lg">
                  Set Time
                </div>
              </button>
            </div>

            {/* Quick Time Pills */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={setNowTime}
                className="flex-1 py-1 px-2.5 rounded-lg text-xs font-bold bg-white hover:bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8] text-center transition-all"
              >
                NOW
              </button>
              <button
                type="button"
                onClick={() => updateTime('09', '00')}
                className="py-1 px-2.5 rounded-lg text-xs font-bold bg-white hover:bg-[#e9f2ef] text-[#50635e] border border-[#d2ded8] text-center transition-all"
              >
                09:00 AM
              </button>
              <button
                type="button"
                onClick={() => updateTime('14', '00')}
                className="py-1 px-2.5 rounded-lg text-xs font-bold bg-white hover:bg-[#e9f2ef] text-[#50635e] border border-[#d2ded8] text-center transition-all"
              >
                02:00 PM
              </button>
            </div>

            {timeError && <p className="text-xs text-rose-600 font-semibold">{timeError}</p>}
          </div>
        </div>

        {/* Custom Flight Booking Style Calendar Modal / Dropdown */}
        {showCalendar && (
          <div className="border-t border-[#d2ded8] bg-white p-5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-4">
              <span className="font-extrabold text-sm text-[#1a2522] tracking-tight">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-[#e9f2ef] text-[#234D42] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-[#e9f2ef] text-[#234D42] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#71817E] mb-2">
              {DAY_NAMES.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const thisYMD = formatDateToYMD(new Date(viewYear, viewMonth, day));
                const isSelected = dateValue === thisYMD;
                const isCurrentToday = thisYMD === todayYMD;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={clsx(
                      'h-8 rounded-xl font-bold flex items-center justify-center transition-all',
                      isSelected
                        ? 'bg-[#234D42] text-white shadow-xs'
                        : isCurrentToday
                        ? 'bg-[#e9f2ef] text-[#234D42] border border-[#234D42]/30'
                        : 'hover:bg-[#f1f5f3] text-[#1a2522]'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Flight Booking Style Time Selector Modal / Dropdown */}
        {showTimePicker && (
          <div className="border-t border-[#d2ded8] bg-white p-5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-4">
              <span className="font-extrabold text-sm text-[#1a2522] tracking-tight">
                Select Exact Gate Time
              </span>
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="text-xs font-bold text-[#234D42] hover:underline"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Hour Selector */}
              <div>
                <span className="text-[10px] font-bold text-[#71817E] uppercase block mb-1.5">
                  Hour (00 - 23)
                </span>
                <div className="grid grid-cols-4 gap-1 max-h-36 overflow-y-auto pr-1">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const hStr = String(h).padStart(2, '0');
                    const isSelected = hours === hStr;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => updateTime(hStr, minutes)}
                        className={clsx(
                          'py-1 text-xs font-mono font-bold rounded-lg transition-all',
                          isSelected
                            ? 'bg-[#234D42] text-white shadow-xs'
                            : 'hover:bg-[#e9f2ef] text-[#354541]'
                        )}
                      >
                        {hStr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Selector */}
              <div>
                <span className="text-[10px] font-bold text-[#71817E] uppercase block mb-1.5">
                  Minute (00 - 55)
                </span>
                <div className="grid grid-cols-3 gap-1 max-h-36 overflow-y-auto pr-1">
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((mStr) => {
                    const isSelected = minutes === mStr;
                    return (
                      <button
                        key={mStr}
                        type="button"
                        onClick={() => updateTime(hours, mStr)}
                        className={clsx(
                          'py-1 text-xs font-mono font-bold rounded-lg transition-all',
                          isSelected
                            ? 'bg-[#234D42] text-white shadow-xs'
                            : 'hover:bg-[#e9f2ef] text-[#354541]'
                        )}
                      >
                        :{mStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
