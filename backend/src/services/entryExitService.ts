import { entryExitRepository } from '../repositories/entryExitRepository';
import { emitNewEvent } from '../sockets';
import { EntryExitInput, LiveFeedItem } from '../types/event';

export const entryExitService = {
  createEntry: async (input: EntryExitInput) => {
    const record = await entryExitRepository.insert(input);

    const liveFeedItem: LiveFeedItem = {
      id: record.id,
      type: 'entry_exit',
      created_at: record.created_at,
      details: {
        visitorName: record.visitor_name,
        visitDate: record.visit_date,
        visitTime: record.visit_time,
        purpose: record.purpose,
        personToMeet: record.person_to_meet,
      },
    };

    emitNewEvent('entry_exit', liveFeedItem as unknown as Record<string, unknown>);
    return record;
  },
};
