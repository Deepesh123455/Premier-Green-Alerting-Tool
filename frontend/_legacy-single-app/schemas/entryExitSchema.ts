import { z } from 'zod';

export const entryExitSchema = z.object({
  visitorName: z.string().trim().min(1, 'Visitor name is required'),
  visitDate: z.string().trim().min(1, 'Visit date is required'),
  visitTime: z.string().trim().min(1, 'Visit time is required'),
  purpose: z.string().trim().min(1, 'Purpose of visit is required'),
  personToMeet: z.string().trim().min(1, 'Person to meet is required'),
});

export type EntryExitFormData = z.infer<typeof entryExitSchema>;
