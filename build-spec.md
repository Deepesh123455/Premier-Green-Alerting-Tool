# Build Spec — Quick Alerting System

Give this whole file to Claude / Claude Code as the first prompt to scaffold the project. It contains everything needed: tech stack, folder structure, field specs, DB schema, API contract, and build order.

---

## 1. What this app does

Three form types are filled from three different phones. Every submission is saved to a database and appears **live** on a dashboard (no refresh) via WebSocket.

1. **Entry / Exit** — visitor log at a gate/reception
2. **Truck Log** — logs a truck delivering/picking up material
3. **Incoming Report** — logs incoming material stock

---

## 2. Tech stack

- **Frontend**: Next.js (App Router) + TypeScript, deployed on Vercel
- **Backend**: Express + TypeScript + Socket.io, deployed on Render
- **Database**: Postgres (via Supabase or Render Postgres)
- **Data layer (frontend)**: TanStack Query
- **Forms**: react-hook-form + zod
- **Real-time**: Socket.io (backend emits, frontend subscribes)
- **No Redis** (single backend instance — not needed at this scale)
- **No Zustand** (no cross-component shared client state needed yet)

Follow the layered architecture and conventions in `backend-coding-standards.md` and `frontend-coding-standards.md` (attach those files alongside this one). Specifically:
- Backend: Route → Controller → Service → Repository. Controllers never touch the DB.
- Frontend: Page → Component → Hook → Lib. Components never call fetch/socket directly.

---

## 3. Form field specs

### 3.1 Entry / Exit
| Field | Key | Type | Required |
|---|---|---|---|
| Visitor name | `visitorName` | string | yes |
| Date | `visitDate` | date | yes |
| Time | `visitTime` | time | yes |
| Purpose of visit | `purpose` | string | yes |
| Person to meet | `personToMeet` | string | yes |

### 3.2 Truck Log
| Field | Key | Type | Required |
|---|---|---|---|
| Driver name | `driverName` | string | yes |
| Vehicle number | `vehicleNumber` | string | yes |
| Material | `material` | string | yes |
| Quantity | `quantity` | number (positive) | yes |
| Rate | `rate` | number (positive) | yes |

> **[FLAG / FUTURE MASTER LOG]**: Total Cost is computed live on the frontend (`quantity * rate`) and displayed on the form and dashboard cards without altering the current DB schema. When implementing the Master Log / Analytics pass later, consider adding `total_amount NUMERIC GENERATED ALWAYS AS (quantity * rate) STORED` or dedicated column to the schema.

### 3.3 Incoming Report
| Field | Key | Type | Required |
|---|---|---|---|
| Material name | `materialName` | string | yes |
| Quantity | `quantity` | number (positive) | yes |
| Price | `price` | number (positive) | yes |
| Vendor name | `vendorName` | string | yes |
| Trader's company | `tradersCompany` | string | yes |

> **[FLAG / FUTURE MASTER LOG]**: Total Inward Value is computed live on the frontend (`quantity * price`) and displayed on the form and dashboard cards. For future Master Log reporting, this can be tracked as a computed column or aggregated view.

---

## 4. Database schema (Postgres) — normalized, one table per domain

Each domain gets its own table with its own `id`. `materials` and `vendors` are shared lookup tables so the same material/vendor is never duplicated as free text across rows.

```sql
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  traders_company TEXT
);

CREATE TABLE entry_exit_logs (
  id SERIAL PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  purpose TEXT NOT NULL,
  person_to_meet TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE truck_logs (
  id SERIAL PRIMARY KEY,
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  rate NUMERIC NOT NULL CHECK (rate > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE incoming_reports (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  vendor_id INTEGER NOT NULL REFERENCES vendors(id),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**"Find or create" pattern for materials/vendors**: when a truck log or incoming report is submitted with a material/vendor name that doesn't exist yet, the service layer looks it up by name — if found, use its `id`; if not, insert it and use the new `id`. This means the person filling the form still just types a name; they never see or manage IDs directly.

**Live feed for the dashboard** (combines all three tables, newest first):
```sql
CREATE VIEW live_feed AS
SELECT id, 'entry_exit' AS type, created_at,
  jsonb_build_object('visitorName', visitor_name, 'visitDate', visit_date, 'visitTime', visit_time,
                      'purpose', purpose, 'personToMeet', person_to_meet) AS details
FROM entry_exit_logs
UNION ALL
SELECT t.id, 'truck_log' AS type, t.created_at,
  jsonb_build_object('driverName', driver_name, 'vehicleNumber', vehicle_number,
                      'material', m.name, 'quantity', quantity, 'rate', rate) AS details
FROM truck_logs t JOIN materials m ON m.id = t.material_id
UNION ALL
SELECT i.id, 'incoming_report' AS type, i.created_at,
  jsonb_build_object('material', m.name, 'quantity', quantity, 'price', price,
                      'vendorName', v.vendor_name, 'tradersCompany', v.traders_company) AS details
FROM incoming_reports i
  JOIN materials m ON m.id = i.material_id
  JOIN vendors v ON v.id = i.vendor_id
ORDER BY created_at DESC;
```

On the frontend, use `${type}-${id}` as the unique React key for feed items, since `id` alone repeats across tables.

---

## 5. API contract

Base URL: `process.env.NEXT_PUBLIC_API_URL` (frontend) / configured Render URL

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/entry-exit` | `{ visitorName, visitDate, visitTime, purpose, personToMeet }` | `{ success, data }` |
| POST | `/api/truck-log` | `{ driverName, vehicleNumber, material, quantity, rate }` | `{ success, data }` |
| POST | `/api/incoming-report` | `{ materialName, quantity, price, vendorName, tradersCompany }` | `{ success, data }` |
| GET | `/api/events` | — | `{ success, data: LiveFeedItem[] }` (queries the `live_feed` view — used for dashboard initial load) |

`material` / `materialName` and `vendorName` + `tradersCompany` are sent as **plain strings** from the frontend — the service layer resolves them to `material_id` / `vendor_id` via find-or-create before inserting into `truck_logs` / `incoming_reports`. The frontend never sends or sees numeric material/vendor IDs.

All error responses: `{ success: false, error: { message } }`

---

## 6. Socket.io contract

- Backend emits `event:new` with the full saved record (including `type`) after every successful insert.
- Frontend dashboard listens for `event:new` and prepends it to the TanStack Query cache for `['events']`.

---

## 7. Folder structure

Use the exact structure from `backend-coding-standards.md` and `frontend-coding-standards.md`. Summary:

```
alerting-system/
├── backend/
│   └── src/{config,routes,controllers,services,repositories,schemas,sockets,middlewares,errors,utils,types}
│       # repositories/ includes: entryExitRepository, truckLogRepository,
│       # incomingReportRepository, materialsRepository, vendorsRepository
└── frontend/
    ├── app/{entry-exit,truck-log,incoming-report,dashboard}/page.tsx
    ├── components/{forms,dashboard,ui}
    ├── hooks/
    ├── lib/
    ├── schemas/
    └── types/
```

`materialsRepository` and `vendorsRepository` expose a single `findOrCreate(name)` (and `findOrCreate(vendorName, tradersCompany)` for vendors) — called from `truckLogService` / `incomingReportService` before inserting the main record.

---

## 8. Build order (do these in sequence)

1. Scaffold `backend/` and `frontend/` as two folders in one repo.
2. Backend: set up `config/db.ts`, `config/env.ts`, and run the full schema from Section 4 (`materials`, `vendors`, `entry_exit_logs`, `truck_logs`, `incoming_reports`, `live_feed` view).
3. Backend: build `materialsRepository` and `vendorsRepository` first (each with a `findOrCreate` function) — truck-log and incoming-report depend on these.
4. Backend: build entry-exit feature fully (schema → repository → service → controller → route) since it has no dependencies, then truck-log, then incoming-report (both using find-or-create for material/vendor).
5. Backend: add `sockets/index.ts`, wire `emitNewEvent()` into each service after a successful insert.
6. Backend: add centralized `errorHandler` middleware and `AppError` class.
7. Frontend: set up `providers.tsx` (QueryClientProvider) and `lib/api.ts`, `lib/socket.ts`.
8. Frontend: build each form page + its zod schema + its `useSubmitX` hook.
9. Frontend: build `dashboard/page.tsx` with `useLiveEvents` hook (initial `useQuery` against `/api/events` + socket subscription updating the same cache). Use `${type}-${id}` as the list key.
10. Test locally: run backend on a port, frontend on another, submit from all three form pages, confirm dashboard updates live.
11. Deploy backend to Render, frontend to Vercel, set `NEXT_PUBLIC_API_URL` on Vercel to the live Render URL.

---

## 9. What NOT to add right now (explicitly out of scope for this build)

- No authentication/RBAC (planned for later — not this pass)
- No Redis
- No Zustand
- No multi-domain routing (single Vercel deployment, route-based pages only)
- No separate `vendor_materials` junction table — the many-to-many between vendors and materials (a vendor can supply many materials, a material can come from many vendors) is already captured naturally by `incoming_reports` having both `vendor_id` and `material_id`, one row per transaction. Do not add a catalog/registry table for this unless explicitly asked later.
