import { db } from '../config/db';
import { TruckLogRecord, QuantityUnit } from '../types/event';

export interface InsertTruckLogData {
  driverName: string;
  vehicleNumber: string;
  materialId: number;
  quantity: number;
  quantityUnit: QuantityUnit;
  rate: number;
}

export const truckLogRepository = {
  insert: async (data: InsertTruckLogData): Promise<TruckLogRecord> => {
    const result = await db.query<TruckLogRecord>(
      `INSERT INTO truck_logs (driver_name, vehicle_number, material_id, quantity, quantity_unit, rate)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, driver_name, vehicle_number, material_id, quantity, quantity_unit, rate, created_at`,
      [data.driverName, data.vehicleNumber, data.materialId, data.quantity, data.quantityUnit, data.rate]
    );

    return result.rows[0];
  },

  findByIdWithMaterial: async (id: number): Promise<TruckLogRecord | null> => {
    const result = await db.query<TruckLogRecord>(
      `SELECT t.id, t.driver_name, t.vehicle_number, t.material_id, t.quantity, t.quantity_unit, t.rate, t.created_at, m.name AS material
       FROM truck_logs t
       JOIN materials m ON m.id = t.material_id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },
};
