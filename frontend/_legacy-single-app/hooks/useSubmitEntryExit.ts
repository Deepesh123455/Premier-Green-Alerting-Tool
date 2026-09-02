import { useMutation } from '@tanstack/react-query';
import { submitEntryExit } from '../lib/api';
import { EntryExitInput } from '../types/event';

export function useSubmitEntryExit() {
  return useMutation({
    mutationFn: (input: EntryExitInput) => submitEntryExit(input),
  });
}
