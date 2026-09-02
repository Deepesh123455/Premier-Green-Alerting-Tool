import {
  EntryExitInput,
  TruckLogInput,
  IncomingReportInput,
  LiveFeedItem,
  ApiResponse,
} from '../types/event';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    error: { message: 'Failed to parse response' },
  }));

  if (!res.ok || !json.success) {
    const errorMsg = json.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }

  return json.data as T;
}

export async function submitEntryExit(input: EntryExitInput) {
  const res = await fetch(`${getBaseUrl()}/api/entry-exit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(res);
}

export async function submitTruckLog(input: TruckLogInput) {
  const res = await fetch(`${getBaseUrl()}/api/truck-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(res);
}

export async function submitIncomingReport(input: IncomingReportInput) {
  const res = await fetch(`${getBaseUrl()}/api/incoming-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(res);
}

export async function fetchAllEvents(): Promise<LiveFeedItem[]> {
  const res = await fetch(`${getBaseUrl()}/api/events`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<LiveFeedItem[]>(res);
}
