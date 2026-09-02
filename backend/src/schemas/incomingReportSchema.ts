import { z } from 'zod';

export const incomingReportSchema = z.object({
  materialName: z.string().trim().min(1, 'Material name is required'),
  quantity: z.coerce.number().positive('Quantity must be a positive number'),
  quantityUnit: z.enum(['MT', 'KG', 'G']).default('MT'),
  price: z.coerce.number().positive('Price must be a positive number'),
  vendorName: z.string().trim().min(1, 'Vendor name is required'),
  tradersCompany: z.string().trim().min(1, "Trader's company is required"),
});

export type IncomingReportSchemaType = z.infer<typeof incomingReportSchema>;
