import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full flex flex-col space-y-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-[#354541]"
        >
          {label}
          {props.required && <span className="text-[#2e5c4f] ml-1">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-4 py-3 bg-white text-[#1a2522] border rounded-xl text-sm placeholder:text-[#AAB6AE] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2e5c4f]/20',
              // Hide the native number spinner arrows across browsers.
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#d2ded8] hover:border-[#AAB6AE] focus:border-[#2e5c4f]'
            ),
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#71817E]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
