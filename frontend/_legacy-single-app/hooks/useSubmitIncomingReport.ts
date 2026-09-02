import { useMutation } from '@tanstack/react-query';
import { submitIncomingReport } from '../lib/api';
import { IncomingReportInput } from '../types/event';

export function useSubmitIncomingReport() {
  return useMutation({
    mutationFn: (input: IncomingReportInput) => submitIncomingReport(input),
  });
}
