CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  traders_company TEXT
);

CREATE TABLE IF NOT EXISTS entry_exit_logs (
  id SERIAL PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  purpose TEXT NOT NULL,
  person_to_meet TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS truck_logs (
  id SERIAL PRIMARY KEY,
  driver_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  quantity_unit TEXT NOT NULL DEFAULT 'MT' CHECK (quantity_unit IN ('MT', 'KG', 'G')),
  rate NUMERIC NOT NULL CHECK (rate > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incoming_reports (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  vendor_id INTEGER NOT NULL REFERENCES vendors(id),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  quantity_unit TEXT NOT NULL DEFAULT 'MT' CHECK (quantity_unit IN ('MT', 'KG', 'G')),
  price NUMERIC NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Backfill for databases that already have these tables from before the
-- quantity_unit column existed. No-op on a fresh install (columns already
-- exist from the CREATE TABLE above), safe to re-run.
ALTER TABLE truck_logs ADD COLUMN IF NOT EXISTS quantity_unit TEXT NOT NULL DEFAULT 'MT';
ALTER TABLE incoming_reports ADD COLUMN IF NOT EXISTS quantity_unit TEXT NOT NULL DEFAULT 'MT';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'truck_logs_quantity_unit_check'
  ) THEN
    ALTER TABLE truck_logs ADD CONSTRAINT truck_logs_quantity_unit_check CHECK (quantity_unit IN ('MT', 'KG', 'G'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'incoming_reports_quantity_unit_check'
  ) THEN
    ALTER TABLE incoming_reports ADD CONSTRAINT incoming_reports_quantity_unit_check CHECK (quantity_unit IN ('MT', 'KG', 'G'));
  END IF;
END $$;

-- Keeps GET /api/events (ORDER BY created_at DESC LIMIT ...) fast as each
-- table grows past tens of thousands of rows, instead of a full sort.
CREATE INDEX IF NOT EXISTS idx_entry_exit_logs_created_at ON entry_exit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_truck_logs_created_at ON truck_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incoming_reports_created_at ON incoming_reports (created_at DESC);

CREATE OR REPLACE VIEW live_feed AS
SELECT id, 'entry_exit' AS type, created_at,
  jsonb_build_object('visitorName', visitor_name, 'visitDate', visit_date, 'visitTime', visit_time,
                      'purpose', purpose, 'personToMeet', person_to_meet) AS details
FROM entry_exit_logs
UNION ALL
SELECT t.id, 'truck_log' AS type, t.created_at,
  jsonb_build_object('driverName', driver_name, 'vehicleNumber', vehicle_number,
                      'material', m.name, 'quantity', quantity, 'quantityUnit', quantity_unit, 'rate', rate) AS details
FROM truck_logs t JOIN materials m ON m.id = t.material_id
UNION ALL
SELECT i.id, 'incoming_report' AS type, i.created_at,
  jsonb_build_object('material', m.name, 'quantity', quantity, 'quantityUnit', quantity_unit, 'price', price,
                      'vendorName', v.vendor_name, 'tradersCompany', v.traders_company) AS details
FROM incoming_reports i
  JOIN materials m ON m.id = i.material_id
  JOIN vendors v ON v.id = i.vendor_id
ORDER BY created_at DESC;
