import { db } from '../config/db';
import { LiveFeedItem } from '../types/event';

export const eventRepository = {
  getLiveFeed: async (limit = 100): Promise<LiveFeedItem[]> => {
    const result = await db.query<LiveFeedItem>(
      'SELECT id, type, created_at, details FROM live_feed ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },
};
