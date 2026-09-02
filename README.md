# Premier Green Alerting Tool

Real-time operations alerting system for Premier Green Innovations. Three form terminals (Entry/Exit, Truck Log, Incoming Report) feed a live dashboard over WebSocket — no refresh needed.

## Structure

```
backend/                 Express + Socket.io + Postgres API
frontend/
├── packages/shared/     Shared components, hooks, schemas, types
└── apps/
    ├── dashboard/        Live feed — localhost:3000
    ├── entry-exit/        Gate terminal — localhost:3001
    ├── truck-log/          Weighbridge terminal — localhost:3002
    └── incoming-report/     Warehouse terminal — localhost:3003
```

Each frontend app is fully independent — its own `package.json`, port, and deploy target — with no links between them. See `build-spec.md` for the original spec and `backend-coding-standards.md` / `frontend-coding-standards.md` for conventions.

## Local development

```bash
# Backend
cd backend && npm install && npm run db:init && npm run dev   # :5000

# Each frontend app (separate terminals)
cd frontend/apps/dashboard && npm install && npm run dev        # :3000
cd frontend/apps/entry-exit && npm install && npm run dev       # :3001
cd frontend/apps/truck-log && npm install && npm run dev        # :3002
cd frontend/apps/incoming-report && npm install && npm run dev  # :3003
```

## Deployment

Backend → Render, each frontend app → its own Vercel project. See the deployment runbook artifact for full steps and required environment variables.
