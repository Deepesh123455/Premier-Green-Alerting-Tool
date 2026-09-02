import { z } from 'zod';

export const truckLogSchema = z.object({
  driverName: z.string().trim().min(1, 'Driver name is required'),
  vehicleNumber: z.string().trim().min(1, 'Vehicle number is required'),
  material: z.string().trim().min(1, 'Material is required'),
  quantity: z.coerce.number().positive('Quantity must be a positive number'),
  quantityUnit: z.enum(['MT', 'KG', 'G']).default('MT'),
  rate: z.coerce.number().positive('Rate must be a positive number'),
});

export type TruckLogSchemaType = z.infer<typeof truckLogSchema>;
