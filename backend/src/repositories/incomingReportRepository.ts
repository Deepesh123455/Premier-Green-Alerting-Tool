import { db } from '../config/db';
import { IncomingReportRecord, QuantityUnit } from '../types/event';

export interface InsertIncomingReportData {
  materialId: number;
  vendorId: number;
  quantity: number;
  quantityUnit: QuantityUnit;
  price: number;
}

export const incomingReportRepository = {
  insert: async (data: InsertIncomingReportData): Promise<IncomingReportRecord> => {
    const result = await db.query<IncomingReportRecord>(
      `INSERT INTO incoming_reports (material_id, vendor_id, quantity, quantity_unit, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, material_id, vendor_id, quantity, quantity_unit, price, created_at`,
      [data.materialId, data.vendorId, data.quantity, data.quantityUnit, data.price]
    );

    return result.rows[0];
  },

  findByIdWithDetails: async (id: number): Promise<IncomingReportRecord | null> => {
    const result = await db.query<IncomingReportRecord>(
      `SELECT i.id, i.material_id, i.vendor_id, i.quantity, i.quantity_unit, i.price, i.created_at,
              m.name AS material, v.vendor_name, v.traders_company
       FROM incoming_reports i
       JOIN materials m ON m.id = i.material_id
       JOIN vendors v ON v.id = i.vendor_id
       WHERE i.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },
};
