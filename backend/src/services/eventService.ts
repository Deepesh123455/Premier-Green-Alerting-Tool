import { eventRepository } from '../repositories/eventRepository';
import { LiveFeedItem } from '../types/event';

export const eventService = {
  getEvents: async (limit?: number): Promise<LiveFeedItem[]> => {
    return eventRepository.getLiveFeed(limit);
  },
};
