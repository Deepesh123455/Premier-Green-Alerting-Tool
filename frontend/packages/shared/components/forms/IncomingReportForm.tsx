'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import { incomingReportSchema, IncomingReportFormData } from '../../schemas/incomingReportSchema';
import { useSubmitIncomingReport } from '../../hooks/useSubmitIncomingReport';
import { Input } from '../ui/Input';
import { QuantityField } from '../ui/QuantityField';
import { Button } from '../ui/Button';

export const IncomingReportForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IncomingReportFormData>({
    resolver: zodResolver(incomingReportSchema),
    defaultValues: {
      materialName: '',
      quantity: undefined,
      quantityUnit: 'MT',
      price: undefined,
      vendorName: '',
      tradersCompany: '',
    },
  });

  const { mutate, isPending, error } = useSubmitIncomingReport();

  const quantity = watch('quantity');
  const price = watch('price');

  // Compute total in real-time on frontend level
  const numQuantity = parseFloat(String(quantity || 0));
  const numPrice = parseFloat(String(price || 0));
  const computedTotal = !isNaN(numQuantity) && !isNaN(numPrice) && numQuantity > 0 && numPrice > 0
    ? (numQuantity * numPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  const onSubmit = (data: IncomingReportFormData) => {
    setSuccessMessage(null);
    mutate(data, {
      onSuccess: () => {
        setSuccessMessage(`Incoming report for "${data.materialName}" recorded successfully! Broadcast sent to Live Dashboard.`);
        reset({
          materialName: '',
          quantity: undefined,
          quantityUnit: 'MT',
          price: undefined,
          vendorName: '',
          tradersCompany: '',
        });
        setTimeout(() => setSuccessMessage(null), 5000);
      },
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-[#e2e8e5] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#71817E]/5">
      <div className="flex items-center justify-between pb-6 border-b border-[#eef2f0]">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Premier Green Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1a2522] tracking-tight">Incoming Report</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
                Warehouse Stock
              </span>
            </div>
            <p className="text-xs text-[#71817E]">Inward inventory & supplier validation</p>
          </div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
          <PackagePlus className="w-5 h-5" />
        </div>
      </div>

      {successMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-[#e9f2ef] border border-[#234D42]/30 text-[#1a3b32] text-sm flex items-center gap-3 animate-pop-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#234D42]" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-pop-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{(error as Error).message || 'Failed to submit incoming report'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Material Name"
          placeholder="e.g. Pure Aluminium Ingot, LDPE Granules"
          required
          helperText="Auto-resolved in database lookup table"
          error={errors.materialName?.message}
          {...register('materialName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuantityField
            label="Quantity"
            placeholder="e.g. 24"
            required
            error={errors.quantity?.message}
            quantityProps={register('quantity')}
            unitProps={register('quantityUnit')}
          />
          <Input
            label="Price (₹ / $)"
            type="number"
            step="any"
            placeholder="e.g. 1200"
            required
            error={errors.price?.message}
            {...register('price')}
          />
        </div>

        {/* Live Computed Total Field */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#d2ded8] flex items-center justify-between transition-all duration-300 ease-out hover:border-[#234D42]/40 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#71817E]">
            <Calculator className="w-4 h-4 text-[#234D42]" />
            <span>Computed Inward Total:</span>
          </div>
          <div className="text-right">
            {computedTotal ? (
              <span className="text-base font-extrabold text-[#234D42] animate-pop-in inline-block">
                ₹ / $ {computedTotal}
              </span>
            ) : (
              <span className="text-xs text-[#AAB6AE] italic">
                Enter quantity & price
              </span>
            )}
          </div>
        </div>

        <Input
          label="Vendor Name"
          placeholder="e.g. Apex Global Suppliers"
          required
          error={errors.vendorName?.message}
          {...register('vendorName')}
        />

        <Input
          label="Trader's Company"
          placeholder="e.g. Premier Green Trading Corp"
          required
          error={errors.tradersCompany?.message}
          {...register('tradersCompany')}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth isLoading={isPending}>
            Submit Incoming Report
          </Button>
        </div>
      </form>
    </div>
  );
};
