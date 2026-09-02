'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, CheckCircle2, AlertCircle, Calculator, Scale } from 'lucide-react';
import { truckLogSchema, TruckLogFormData } from '../../schemas/truckLogSchema';
import { useSubmitTruckLog } from '../../hooks/useSubmitTruckLog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const TruckLogForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [weightUnit, setWeightUnit] = useState<'MT' | 'KG' | 'GM'>('MT');

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
      rate: undefined,
    },
  });

  const { mutate, isPending, error } = useSubmitTruckLog();

  const quantity = watch('quantity');
  const rate = watch('rate');

  // Compute total in real-time on frontend level
  const numQuantity = parseFloat(String(quantity || 0));
  const numRate = parseFloat(String(rate || 0));
  const computedTotal = !isNaN(numQuantity) && !isNaN(numRate) && numQuantity > 0 && numRate > 0
    ? (numQuantity * numRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  const onSubmit = (data: TruckLogFormData) => {
    setSuccessMessage(null);
    mutate(data, {
      onSuccess: () => {
        setSuccessMessage(`Truck log for "${data.vehicleNumber}" (${data.quantity} ${weightUnit}) recorded successfully! Broadcast sent to Live Dashboard.`);
        reset({
          driverName: '',
          vehicleNumber: '',
          material: '',
          quantity: undefined,
          rate: undefined,
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
              <h2 className="text-lg font-bold text-[#1a2522] tracking-tight">Truck Log</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
                Weighbridge
              </span>
            </div>
            <p className="text-xs text-[#71817E]">Vehicle & payload dispatched/received</p>
          </div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      {successMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-[#e9f2ef] border border-[#234D42]/30 text-[#1a3b32] text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#234D42]" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{(error as Error).message || 'Failed to submit truck log'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Driver Name"
          placeholder="e.g. Ramesh Singh"
          required
          error={errors.driverName?.message}
          {...register('driverName')}
        />

        <Input
          label="Vehicle Number"
          placeholder="e.g. DL-01-AB-1234"
          required
          error={errors.vehicleNumber?.message}
          {...register('vehicleNumber')}
        />

        <Input
          label="Material"
          placeholder="e.g. Recycled PET Flakes, HDPE Regrind"
          required
          helperText="Auto-resolved in database lookup table"
          error={errors.material?.message}
          {...register('material')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quantity with Custom Unit Dropdown (MT / KG / GM) */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#354541] flex items-center justify-between">
              <span>Quantity <span className="text-[#234D42]">*</span></span>
              <span className="text-[10px] text-[#71817E] lowercase">in {weightUnit}</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="any"
                placeholder="e.g. 15.5"
                className="w-full pl-4 pr-24 py-3 bg-white text-[#1a2522] border border-[#d2ded8] hover:border-[#AAB6AE] focus:border-[#234D42] rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#234D42]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                {...register('quantity')}
              />
              {/* Unit Dropdown */}
              <div className="absolute right-1.5 flex items-center">
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as 'MT' | 'KG' | 'GM')}
                  className="bg-[#e9f2ef] hover:bg-[#dbeae4] text-[#234D42] font-bold text-xs px-2.5 py-1.5 rounded-lg border border-[#d2ded8] focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="MT">MT (Tonne)</option>
                  <option value="KG">KG (Kilo)</option>
                  <option value="GM">GM (Gram)</option>
                </select>
              </div>
            </div>
            {errors.quantity?.message && (
              <p className="text-xs text-rose-600 font-medium">{errors.quantity.message}</p>
            )}
          </div>

          <Input
            label={`Rate (₹ / $ per ${weightUnit})`}
            type="number"
            step="any"
            placeholder="e.g. 450"
            required
            error={errors.rate?.message}
            {...register('rate')}
          />
        </div>

        {/* Live Computed Total Field */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-[#d2ded8] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#71817E]">
            <Calculator className="w-4 h-4 text-[#234D42]" />
            <span>Computed Total Cost ({weightUnit}):</span>
          </div>
          <div className="text-right">
            {computedTotal ? (
              <span className="text-base font-extrabold text-[#234D42]">
                ₹ / $ {computedTotal}
              </span>
            ) : (
              <span className="text-xs text-[#AAB6AE] italic">
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
