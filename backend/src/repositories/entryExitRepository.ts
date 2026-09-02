import { db } from '../config/db';
import { EntryExitInput, EntryExitRecord } from '../types/event';

export const entryExitRepository = {
  insert: async (input: EntryExitInput): Promise<EntryExitRecord> => {
    const result = await db.query<EntryExitRecord>(
      `INSERT INTO entry_exit_logs (visitor_name, visit_date, visit_time, purpose, person_to_meet)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, visitor_name, visit_date, visit_time, purpose, person_to_meet, created_at`,
      [input.visitorName, input.visitDate, input.visitTime, input.purpose, input.personToMeet]
    );

    return result.rows[0];
  },

  findById: async (id: number): Promise<EntryExitRecord | null> => {
    const result = await db.query<EntryExitRecord>(
      'SELECT id, visitor_name, visit_date, visit_time, purpose, person_to_meet, created_at FROM entry_exit_logs WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },
};
