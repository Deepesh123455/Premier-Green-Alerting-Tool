import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchAllEvents } from '../lib/api';
import { getSocket } from '../lib/socket';
import { LiveFeedItem } from '../types/event';

export function useLiveEvents() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.events,
    queryFn: fetchAllEvents,
    staleTime: Infinity,
  });

  useEffect(() => {
    const socket = getSocket();

    const handleNewEvent = (newRecord: LiveFeedItem) => {
      queryClient.setQueryData<LiveFeedItem[]>(queryKeys.events, (old = []) => {
        // Avoid duplicate additions if socket or cache already received it
        const exists = old.some(
          (item) => item.id === newRecord.id && item.type === newRecord.type
        );
        if (exists) return old;
        return [newRecord, ...old];
      });
    };

    socket.on('event:new', handleNewEvent);

    return () => {
      socket.off('event:new', handleNewEvent);
    };
  }, [queryClient]);

  return query;
}
