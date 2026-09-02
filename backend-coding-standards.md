# Backend Coding Standards — Alerting System

Applies to: `backend/` (Express + TypeScript + Socket.io + Postgres/Prisma)

---

## 1. Architecture: Layered

Every feature (entry-exit, truck-log, incoming-report) follows the same four-layer flow. No layer is allowed to skip ahead — a controller never queries the DB directly, and a service never touches `req`/`res`.

```
Route  →  Controller  →  Service  →  Repository  →  Database
```

| Layer | Responsibility | Must NOT do |
|---|---|---|
| **Route** | Maps an HTTP method + path to a controller function. Attaches validation middleware. | Business logic, DB access |
| **Controller** | Reads `req`, calls the service, sends `res`. Translates thrown errors into HTTP responses via `next(err)`. | Business logic, DB queries, validation logic (only wires up middleware) |
| **Service** | Business logic. Decides *what* should happen — e.g. "save the entry, then notify the dashboard." Calls one or more repositories. | Touching `req`/`res`, raw SQL/Prisma calls |
| **Repository** | The only layer allowed to talk to the database (raw SQL or Prisma). Pure data access — no business rules. | Business logic, emitting sockets |

**Rule of thumb:** if you're tempted to write a DB query inside a controller, stop — it belongs in a repository, called from a service.

---

## 2. Folder structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts                     # Postgres pool / Prisma client init
│   │   └── env.ts                    # loads & validates env vars
│   │
│   ├── routes/
│   │   ├── entryExitRoutes.ts
│   │   ├── truckLogRoutes.ts
│   │   ├── incomingReportRoutes.ts
│   │   └── index.ts                  # mounts all routes on the app
│   │
│   ├── controllers/
│   │   ├── entryExitController.ts
│   │   ├── truckLogController.ts
│   │   └── incomingReportController.ts
│   │
│   ├── services/
│   │   ├── entryExitService.ts
│   │   ├── truckLogService.ts
│   │   └── incomingReportService.ts
│   │
│   ├── repositories/
│   │   ├── entryExitRepository.ts
│   │   ├── truckLogRepository.ts
│   │   └── incomingReportRepository.ts
│   │
│   ├── schemas/                      # zod input validation schemas
│   │   ├── entryExitSchema.ts
│   │   ├── truckLogSchema.ts
│   │   └── incomingReportSchema.ts
│   │
│   ├── sockets/
│   │   └── index.ts                  # socket.io init + emitNewEvent()
│   │
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   │
│   ├── errors/
│   │   └── AppError.ts               # custom error class
│   │
│   ├── utils/
│   │   └── logger.ts
│   │
│   ├── types/
│   │   └── event.d.ts                # shared TS types/interfaces
│   │
│   ├── app.ts                        # express app + middleware + routes
│   └── server.ts                     # http server + socket.io attach + listen
│
├── prisma/                           # only if using Prisma
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 3. Naming conventions

- **Files**: `camelCase`, suffixed by layer — `entryExitController.ts`, `entryExitService.ts`, `entryExitRepository.ts`. The suffix must match the layer, always.
- **Functions**: `verbNoun` — `createEntry`, `getEventsByType`, `findRecentTruckLogs`.
- **Types/interfaces**: `PascalCase` — `EntryExitInput`, `TruckLogRecord`.
- **DB tables/columns**: `snake_case` (Postgres convention) — `truck_qty`, `created_at`.
- **Socket events**: `kebab-case`, namespaced — `event:new`, not `newEvent` or `NewEvent`.

---

## 4. Full request lifecycle example (entry-exit)

**Route** — wires validation + controller, nothing else:
```ts
// routes/entryExitRoutes.ts
router.post('/', validateRequest(entryExitSchema), entryExitController.create);
```

**Controller** — only req/res, delegates everything else:
```ts
// controllers/entryExitController.ts
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const record = await entryExitService.createEntry(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}
```

**Service** — business logic + orchestration (save, then notify):
```ts
// services/entryExitService.ts
export async function createEntry(input: EntryExitInput) {
  const record = await entryExitRepository.insert(input);
  emitNewEvent('entry_exit', record);   // socket notification lives here, not in controller
  return record;
}
```

**Repository** — the only place touching the DB:
```ts
// repositories/entryExitRepository.ts
export async function insert(input: EntryExitInput) {
  const result = await db.query(
    `INSERT INTO events (type, visitor_name, visit_date, visit_time, purpose, person_to_meet)
     VALUES ('entry_exit', $1, $2, $3, $4, $5) RETURNING *`,
    [input.visitorName, input.visitDate, input.visitTime, input.purpose, input.personToMeet]
  );
  return result.rows[0];
}
```

---

## 5. Validation

- All input validation lives in `schemas/` using **zod**.
- Validation runs in middleware (`validateRequest`), **before** the controller is even called — controllers should be able to assume `req.body` is already valid and typed.
- Never re-validate inside the service or repository — one source of truth.

---

## 6. Error handling

- Throw a custom `AppError(message, statusCode)` from services/repositories when something goes wrong (not-found, invalid state, DB failure).
- Controllers never handle errors themselves beyond `catch (err) { next(err); }`.
- One centralized `errorHandler` middleware (registered last in `app.ts`) converts any thrown error into a consistent JSON response.

```ts
// errors/AppError.ts
export class AppError extends Error {
  constructor(public message: string, public statusCode = 500) {
    super(message);
  }
}
```

---

## 7. API response format

Every endpoint returns one of these two shapes — no exceptions:

```jsonc
// success
{ "success": true, "data": { ... } }

// failure
{ "success": false, "error": { "message": "Truck quantity must be positive" } }
```

---

## 8. Socket.io conventions

- Socket setup lives only in `sockets/index.ts` — nowhere else creates or configures `io`.
- Services call a single exported helper (`emitNewEvent(type, record)`) to broadcast — they never import `io` directly.
- Event name format: `event:new`. If you later split by type, use `event:entry-exit:new`, etc. — always kebab-case with colons as namespace separators.

---

## 9. TypeScript rules

- `strict: true` in `tsconfig.json` — non-negotiable.
- No `any`. If a type is genuinely unknown, use `unknown` and narrow it.
- Shared types/interfaces go in `types/`, imported wherever needed — never redefine the same shape twice.

---

## 10. Environment variables

- `.env` is never committed. `.env.example` must always be kept up to date with every key the app needs (empty values, just the keys).
- All env access goes through `config/env.ts`, which validates required keys exist at startup and throws immediately if one is missing — never read `process.env.X` directly in a controller/service/repository.

---

## 11. Git commit convention

Use conventional commits so history stays scannable:

```
feat(truck-log): add repository and service layer
fix(entry-exit): correct date validation in schema
chore(config): add env validation on startup
```
