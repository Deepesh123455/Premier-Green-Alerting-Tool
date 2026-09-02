import { db } from '../config/db';
import { MaterialRecord } from '../types/event';

export const materialsRepository = {
  findOrCreate: async (name: string): Promise<MaterialRecord> => {
    const trimmedName = name.trim();

    // Check if material already exists (case-insensitive search)
    const existing = await db.query<MaterialRecord>(
      'SELECT id, name FROM materials WHERE LOWER(name) = LOWER($1) LIMIT 1',
      [trimmedName]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // Insert new material with ON CONFLICT resolution
    const inserted = await db.query<MaterialRecord>(
      `INSERT INTO materials (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name`,
      [trimmedName]
    );

    return inserted.rows[0];
  },

  findById: async (id: number): Promise<MaterialRecord | null> => {
    const result = await db.query<MaterialRecord>(
      'SELECT id, name FROM materials WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },
};
