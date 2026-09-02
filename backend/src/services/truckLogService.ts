import { materialsRepository } from '../repositories/materialsRepository';
import { truckLogRepository } from '../repositories/truckLogRepository';
import { emitNewEvent } from '../sockets';
import { TruckLogInput, LiveFeedItem } from '../types/event';

export const truckLogService = {
  createTruckLog: async (input: TruckLogInput) => {
    // 1. Find or create material
    const material = await materialsRepository.findOrCreate(input.material);

    // 2. Insert truck log record
    const record = await truckLogRepository.insert({
      driverName: input.driverName,
      vehicleNumber: input.vehicleNumber,
      materialId: material.id,
      quantity: input.quantity,
      quantityUnit: input.quantityUnit,
      rate: input.rate,
    });

    // 3. Format unified live feed item and broadcast via Socket.io
    const liveFeedItem: LiveFeedItem = {
      id: record.id,
      type: 'truck_log',
      created_at: record.created_at,
      details: {
        driverName: record.driver_name,
        vehicleNumber: record.vehicle_number,
        material: material.name,
        quantity: record.quantity,
        quantityUnit: record.quantity_unit,
        rate: record.rate,
      },
    };

    emitNewEvent('truck_log', liveFeedItem as unknown as Record<string, unknown>);
    return {
      ...record,
      material: material.name,
    };
  },
};
