-- ==========================================================
-- AddPlus Immigration Solutions
-- Website Inquiry Database
-- Migration 0001
-- ==========================================================


CREATE TABLE IF NOT EXISTS inquiries (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    first_name TEXT NOT NULL,

    last_name TEXT NOT NULL,

    email TEXT NOT NULL,

    phone TEXT,

    citizenship TEXT,

    residence TEXT,

    service TEXT NOT NULL,

    referral TEXT,

    case_summary TEXT NOT NULL,

    form_source TEXT NOT NULL DEFAULT 'website',

    status TEXT NOT NULL DEFAULT 'new',

    internal_notes TEXT,

    contacted_at TEXT,

    closed_at TEXT

);


-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_inquiries_submitted_at
ON inquiries(submitted_at);


CREATE INDEX IF NOT EXISTS idx_inquiries_status
ON inquiries(status);


CREATE INDEX IF NOT EXISTS idx_inquiries_email
ON inquiries(email);


CREATE INDEX IF NOT EXISTS idx_inquiries_service
ON inquiries(service);