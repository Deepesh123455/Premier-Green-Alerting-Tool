import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface QuantityFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  quantityProps: UseFormRegisterReturn;
  unitProps: UseFormRegisterReturn;
}

const UNITS = ['MT', 'KG', 'G'] as const;

export const QuantityField: React.FC<QuantityFieldProps> = ({
  label,
  placeholder,
  required,
  error,
  quantityProps,
  unitProps,
}) => {
  return (
    <div className="w-full flex flex-col space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[#354541] flex items-center justify-between">
        <span>
          {label} {required && <span className="text-[#234D42]">*</span>}
        </span>
      </label>
      <div className="flex gap-1.5 items-center">
        {/* Increased Size Number Input */}
        <input
          type="number"
          step="any"
          placeholder={placeholder}
          className={`flex-1 min-w-0 px-4 py-3 bg-white text-[#1a2522] border rounded-xl text-sm placeholder:text-[#AAB6AE] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#234D42]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-[#d2ded8] hover:border-[#AAB6AE] focus:border-[#234D42]'
          }`}
          {...quantityProps}
        />
        {/* Compact Decreased Size Unit Dropdown */}
        <select
          className="w-[68px] shrink-0 px-1.5 py-3 bg-[#e9f2ef] hover:bg-[#dce9e4] text-[#234D42] border border-[#d2ded8] rounded-xl text-xs font-extrabold text-center focus:outline-none focus:ring-2 focus:ring-[#234D42]/20 focus:border-[#234D42] transition-colors cursor-pointer"
          {...unitProps}
        >
          {UNITS.map((unit) => (
            <option key={unit} value={unit} className="bg-white text-[#1a2522] font-semibold text-xs">
              {unit}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
