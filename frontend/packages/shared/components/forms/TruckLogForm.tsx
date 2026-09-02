'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import { truckLogSchema, TruckLogFormData } from '../../schemas/truckLogSchema';
import { useSubmitTruckLog } from '../../hooks/useSubmitTruckLog';
import { Input } from '../ui/Input';
import { QuantityField } from '../ui/QuantityField';
import { Button } from '../ui/Button';

export const TruckLogForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TruckLogFormData>({
    resolver: zodResolver(truckLogSchema),
    defaultValues: {
      driverName: '',
      vehicleNumber: '',
      material: '',
      quantity: undefined,
      quantityUnit: 'MT',
      rate: undefined,
    },
  });

  const { mutate, isPending, error } = useSubmitTruckLog();

  const quantity = watch('quantity');
  const rate = watch('rate');

  // Compute total in real-time on frontend level (₹ Rupees)
  const numQuantity = parseFloat(String(quantity || 0));
  const numRate = parseFloat(String(rate || 0));
  const computedTotal = !isNaN(numQuantity) && !isNaN(numRate) && numQuantity > 0 && numRate > 0
    ? (numQuantity * numRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  const onSubmit = (data: TruckLogFormData) => {
    setSuccessMessage(null);
    mutate(data, {
      onSuccess: () => {
        setSuccessMessage(`Truck log for "${data.vehicleNumber}" recorded successfully! Broadcast sent to Live Dashboard.`);
        reset({
          driverName: '',
          vehicleNumber: '',
          material: '',
          quantity: undefined,
          quantityUnit: 'MT',
          rate: undefined,
        });
        setTimeout(() => setSuccessMessage(null), 5000);
      },
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-[#e2e8e5] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl shadow-[#71817E]/5">
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#eef2f0] gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Premier Green Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#1a2522] tracking-tight truncate">Truck Log</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
                Weighbridge
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#71817E] truncate">Fleet material weight & logistics recording</p>
          </div>
        </div>
        <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8] shrink-0">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {successMessage && (
        <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-[#e9f2ef] border border-[#234D42]/30 text-[#1a3b32] text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3 animate-pop-in">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#234D42]" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3 animate-pop-in">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-rose-600" />
          <span>{(error as Error).message || 'Failed to submit truck log'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-4">
        <Input
          label="Driver Name"
          placeholder="e.g. Ramesh Kumar"
          required
          error={errors.driverName?.message}
          {...register('driverName')}
        />

        <Input
          label="Vehicle Number"
          placeholder="e.g. MH-12-AB-1234"
          required
          error={errors.vehicleNumber?.message}
          {...register('vehicleNumber')}
        />

        <Input
          label="Material"
          placeholder="e.g. Recycled HDPE Granules"
          required
          error={errors.material?.message}
          {...register('material')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <QuantityField
            label="Quantity"
            placeholder="e.g. 15"
            required
            error={errors.quantity?.message}
            quantityProps={register('quantity')}
            unitProps={register('quantityUnit')}
          />
          <Input
            label="Rate (₹)"
            type="number"
            step="any"
            placeholder="e.g. 45"
            required
            error={errors.rate?.message}
            {...register('rate')}
          />
        </div>

        {/* Live Computed Total Field in Rupees */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f8faf9] border border-[#d2ded8] flex items-center justify-between transition-all duration-300 ease-out hover:border-[#234D42]/40 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#71817E]">
            <Calculator className="w-4 h-4 text-[#234D42] shrink-0" />
            <span className="text-xs sm:text-sm">Computed Total Cost:</span>
          </div>
          <div className="text-right">
            {computedTotal ? (
              <span className="text-sm sm:text-base font-extrabold text-[#234D42] animate-pop-in inline-block">
                ₹ {computedTotal}
              </span>
            ) : (
              <span className="text-[11px] sm:text-xs text-[#AAB6AE] italic">
                Enter quantity & rate
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" fullWidth isLoading={isPending}>
            Submit Truck Log
          </Button>
        </div>
      </form>
    </div>
  );
};
