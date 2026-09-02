import { useMutation } from '@tanstack/react-query';
import { submitTruckLog } from '../lib/api';
import { TruckLogInput } from '../types/event';

export function useSubmitTruckLog() {
  return useMutation({
    mutationFn: (input: TruckLogInput) => submitTruckLog(input),
  });
}
