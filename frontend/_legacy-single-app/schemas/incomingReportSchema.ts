import { z } from 'zod';

export const incomingReportSchema = z.object({
  materialName: z.string().trim().min(1, 'Material name is required'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantity is required' }).positive('Quantity must be greater than 0'),
  price: z.coerce.number({ invalid_type_error: 'Price is required' }).positive('Price must be greater than 0'),
  vendorName: z.string().trim().min(1, 'Vendor name is required'),
  tradersCompany: z.string().trim().min(1, "Trader's company is required"),
});

export type IncomingReportFormData = z.infer<typeof incomingReportSchema>;
