import { db } from '../config/db';
import { VendorRecord } from '../types/event';

export const vendorsRepository = {
  findOrCreate: async (vendorName: string, tradersCompany?: string): Promise<VendorRecord> => {
    const trimmedVendor = vendorName.trim();
    const trimmedCompany = tradersCompany ? tradersCompany.trim() : null;

    // Check if vendor already exists
    const existing = await db.query<VendorRecord>(
      `SELECT id, vendor_name, traders_company 
       FROM vendors 
       WHERE LOWER(vendor_name) = LOWER($1) 
         AND (
           ($2::TEXT IS NULL AND traders_company IS NULL) 
           OR LOWER(COALESCE(traders_company, '')) = LOWER(COALESCE($2, ''))
         )
       LIMIT 1`,
      [trimmedVendor, trimmedCompany]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // Insert new vendor
    const inserted = await db.query<VendorRecord>(
      `INSERT INTO vendors (vendor_name, traders_company)
       VALUES ($1, $2)
       RETURNING id, vendor_name, traders_company`,
      [trimmedVendor, trimmedCompany]
    );

    return inserted.rows[0];
  },

  findById: async (id: number): Promise<VendorRecord | null> => {
    const result = await db.query<VendorRecord>(
      'SELECT id, vendor_name, traders_company FROM vendors WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },
};
