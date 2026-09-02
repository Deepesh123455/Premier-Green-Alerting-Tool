'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { entryExitSchema, EntryExitFormData } from '../../schemas/entryExitSchema';
import { useSubmitEntryExit } from '../../hooks/useSubmitEntryExit';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const EntryExitForm: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EntryExitFormData>({
    resolver: zodResolver(entryExitSchema),
    defaultValues: {
      visitorName: '',
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toTimeString().slice(0, 5),
      purpose: '',
      personToMeet: '',
    },
  });

  const { mutate, isPending, error } = useSubmitEntryExit();

  const onSubmit = (data: EntryExitFormData) => {
    setSuccessMessage(null);
    mutate(data, {
      onSuccess: () => {
        setSuccessMessage(`Entry log for "${data.visitorName}" recorded successfully! Broadcast sent to Live Dashboard.`);
        reset({
          visitorName: '',
          visitDate: new Date().toISOString().split('T')[0],
          visitTime: new Date().toTimeString().slice(0, 5),
          purpose: '',
          personToMeet: '',
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
              <h2 className="text-lg font-bold text-[#1a2522] tracking-tight">Entry / Exit Log</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
                Gate Terminal
              </span>
            </div>
            <p className="text-xs text-[#71817E]">Visitor arrival & departure tracking</p>
          </div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#e9f2ef] text-[#234D42] border border-[#d2ded8]">
          <ShieldCheck className="w-5 h-5" />
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
          <span>{(error as Error).message || 'Failed to submit entry log'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Visitor Name"
          placeholder="e.g. John Doe"
          required
          error={errors.visitorName?.message}
          {...register('visitorName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Visit Date"
            type="date"
            required
            error={errors.visitDate?.message}
            {...register('visitDate')}
          />
          <Input
            label="Visit Time"
            type="time"
            required
            error={errors.visitTime?.message}
            {...register('visitTime')}
          />
        </div>

        <Input
          label="Purpose of Visit"
          placeholder="e.g. Material Inspection, Client Meeting"
          required
          error={errors.purpose?.message}
          {...register('purpose')}
        />

        <Input
          label="Person to Meet"
          placeholder="e.g. Operations Manager"
          required
          error={errors.personToMeet?.message}
          {...register('personToMeet')}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth isLoading={isPending}>
            Submit Visitor Entry
          </Button>
        </div>
      </form>
    </div>
  );
};
