import { z } from 'zod';

export const truckLogSchema = z.object({
  driverName: z.string().trim().min(1, 'Driver name is required'),
  vehicleNumber: z.string().trim().min(1, 'Vehicle number is required'),
  material: z.string().trim().min(1, 'Material is required'),
  quantity: z.coerce.number({ invalid_type_error: 'Quantity is required' }).positive('Quantity must be greater than 0'),
  rate: z.coerce.number({ invalid_type_error: 'Rate is required' }).positive('Rate must be greater than 0'),
});

export type TruckLogFormData = z.infer<typeof truckLogSchema>;
