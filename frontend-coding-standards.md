# Frontend Coding Standards — Alerting System

Applies to: `frontend/` (Next.js App Router + TypeScript + TanStack Query + Socket.io client)

---

## 1. Architecture: Page → Component → Hook → Lib

Same idea as the backend's layering, adapted for frontend:

```
Page (route)  →  Component (UI)  →  Hook (data logic)  →  Lib (raw API/socket calls)
```

| Layer | Responsibility | Must NOT do |
|---|---|---|
| **Page** (`app/*/page.tsx`) | Composes components for that route. Minimal logic — just layout + which components render. | Direct fetch calls, direct socket handling |
| **Component** (`components/`) | Pure UI — renders props, calls hooks for data/actions. | Raw `fetch`/`axios` calls, raw socket `.on()`/`.emit()` |
| **Hook** (`hooks/`) | Wraps TanStack Query (`useQuery`/`useMutation`) or socket subscriptions. This is where "how do we get/send this data" lives. | JSX/rendering logic |
| **Lib** (`lib/`) | Raw API client and socket instance — the actual `fetch()` calls and the single `io()` connection. | React-specific code (no hooks here) |

**Rule of thumb:** a component should never import `lib/api.ts` or `lib/socket.ts` directly — it always goes through a hook.

---

## 2. Folder structure

```
frontend/
├── app/
│   ├── entry-exit/page.tsx
│   ├── truck-log/page.tsx
│   ├── incoming-report/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── providers.tsx                 # wraps app in QueryClientProvider
│
├── components/
│   ├── forms/
│   │   ├── EntryExitForm.tsx
│   │   ├── TruckLogForm.tsx
│   │   └── IncomingReportForm.tsx
│   ├── dashboard/
│   │   ├── LiveFeed.tsx
│   │   └── EventCard.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
│
├── hooks/
│   ├── useSubmitEntryExit.ts
│   ├── useSubmitTruckLog.ts
│   ├── useSubmitIncomingReport.ts
│   └── useLiveEvents.ts              # subscribes to socket, updates query cache
│
├── lib/
│   ├── api.ts                        # fetch wrapper, one function per endpoint
│   └── socket.ts                     # single socket.io-client instance
│
├── schemas/
│   ├── entryExitSchema.ts            # zod — mirrors backend schema
│   ├── truckLogSchema.ts
│   └── incomingReportSchema.ts
│
├── types/
│   └── event.d.ts
│
├── .env.local
├── tsconfig.json
└── package.json
```

---

## 3. Naming conventions

- **Component files**: `PascalCase.tsx` — `TruckLogForm.tsx`, `EventCard.tsx`.
- **Hook files**: `camelCase.ts`, always prefixed `use` — `useSubmitTruckLog.ts`.
- **Types/interfaces**: `PascalCase` — `TruckLogInput`, `EventRecord`.
- **Query keys**: array-based, defined once as constants, never inline strings scattered across files.

```ts
// lib/queryKeys.ts
export const queryKeys = {
  events: ['events'] as const,
};
```

---

## 4. Data fetching — TanStack Query rules

- One custom hook per action. A form never calls `useMutation` inline — it calls `useSubmitTruckLog()`.
- Initial dashboard data loads via `useQuery`; live updates come through the socket and get pushed into the **same cache** via `queryClient.setQueryData()` — never maintain a separate `useState` list alongside the query cache. One source of truth only.

```ts
// hooks/useLiveEvents.ts
export function useLiveEvents() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.events,
    queryFn: fetchAllEvents,
  });

  useEffect(() => {
    const socket = getSocket();
    socket.on('event:new', (newRecord: EventRecord) => {
      queryClient.setQueryData(queryKeys.events, (old: EventRecord[] = []) => [newRecord, ...old]);
    });
    return () => { socket.off('event:new'); };
  }, [queryClient]);

  return query;
}
```

```ts
// hooks/useSubmitTruckLog.ts
export function useSubmitTruckLog() {
  return useMutation({
    mutationFn: (input: TruckLogInput) => submitTruckLog(input),
  });
}
```

---

## 5. Forms — react-hook-form + zod

- Every form uses `react-hook-form` with `zodResolver`, pointing at the matching schema in `schemas/`.
- Validation error messages come from the zod schema itself — never hardcode duplicate error strings in the component.

```tsx
// components/forms/TruckLogForm.tsx
const { register, handleSubmit, formState: { errors } } = useForm<TruckLogInput>({
  resolver: zodResolver(truckLogSchema),
});
const { mutate, isPending } = useSubmitTruckLog();

const onSubmit = (data: TruckLogInput) => mutate(data);
```

---

## 6. Socket conventions

- Exactly **one** socket connection per app, created in `lib/socket.ts` and reused everywhere via `getSocket()`. Never call `io(...)` inside a component or hook directly — this causes duplicate connections and duplicate event handling.
- Always clean up listeners in the `useEffect` return function (`socket.off(...)`) to avoid stacking duplicate handlers on re-render.

```ts
// lib/socket.ts
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!);
  }
  return socket;
}
```

---

## 7. API layer (`lib/api.ts`)

- One exported function per backend endpoint. Components/hooks never construct URLs or call `fetch` directly.

```ts
// lib/api.ts
export async function submitTruckLog(input: TruckLogInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/truck-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to submit truck log');
  return res.json();
}
```

---

## 8. TypeScript rules

- `strict: true` in `tsconfig.json`.
- No `any` — use the shared types in `types/` or infer types from zod schemas with `z.infer<typeof schema>`.
- Prefer deriving types from schemas over writing them twice:

```ts
export const truckLogSchema = z.object({ /* ... */ });
export type TruckLogInput = z.infer<typeof truckLogSchema>;
```

---

## 9. Styling

- Tailwind utility classes only. No inline `style={{}}` except for genuinely dynamic values (e.g. a computed width/color from data) that can't be expressed as a class.
- Shared, repeated UI (buttons, inputs) live in `components/ui/` — never copy-paste the same button markup across three forms.

---

## 10. Environment variables

- All client-exposed env vars must be prefixed `NEXT_PUBLIC_` (Next.js requirement) — e.g. `NEXT_PUBLIC_API_URL`.
- `.env.local` is never committed.

---

## 11. Do's and don'ts — quick reference

| Do | Don't |
|---|---|
| Call hooks from components | Call `fetch`/`io()` directly from components |
| Keep one socket instance in `lib/socket.ts` | Create a new socket connection per component |
| Derive types from zod schemas | Duplicate type definitions by hand |
| Update the query cache on socket events | Keep a separate `useState` list alongside query data |
| Centralize query keys in one file | Hardcode query key strings inline in multiple places |
