PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ashrams (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_gu TEXT NOT NULL,
  region_gu TEXT NOT NULL,
  address_gu TEXT,
  phone TEXT,
  map_url TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_gu TEXT NOT NULL,
  description_gu TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  venue_gu TEXT,
  ashram_id TEXT,
  image_key TEXT,
  youtube_url TEXT,
  registration_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived','cancelled')),
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ashram_id) REFERENCES ashrams(id)
);

CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_gu TEXT NOT NULL,
  category TEXT NOT NULL,
  edition_month_gu TEXT,
  year INTEGER,
  pdf_key TEXT,
  cover_key TEXT,
  description_gu TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  email TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','archived')),
  assigned_to TEXT,
  internal_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS committee_roles (
  email TEXT PRIMARY KEY,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin','content_editor','event_manager','media_manager','forms_manager','ashram_manager','viewer')),
  ashram_scope TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  detail_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_status_starts ON events(status, starts_at);
CREATE INDEX IF NOT EXISTS idx_ashrams_region ON ashrams(region_gu);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year DESC);
