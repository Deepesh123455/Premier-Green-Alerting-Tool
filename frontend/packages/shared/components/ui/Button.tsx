import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  variant = 'primary',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm px-5 py-3 text-sm cursor-pointer active:scale-[0.985]';

  const variants = {
    primary:
      'bg-[#234D42] hover:bg-[#1a3b32] hover:-translate-y-0.5 hover:shadow-md text-white focus:ring-[#234D42] shadow-[#234D42]/20',
    secondary:
      'bg-[#e9f2ef] hover:bg-[#d8e8e3] hover:-translate-y-0.5 text-[#234D42] border border-[#d2ded8] focus:ring-[#234D42]',
    outline:
      'bg-white hover:bg-[#f8faf9] hover:-translate-y-0.5 text-[#234D42] border border-[#AAB6AE] hover:border-[#234D42] focus:ring-[#234D42]',
    danger:
      'bg-rose-600 hover:bg-rose-700 hover:-translate-y-0.5 text-white focus:ring-rose-500 shadow-rose-600/20',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
          <span>Processing Submission...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
