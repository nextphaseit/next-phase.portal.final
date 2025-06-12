-- Add soft delete columns to existing tables
-- This allows for "undo" functionality and better audit trails

-- Add deleted_at column to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add deleted_at column to users table  
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add deleted_at column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Create indexes for better performance on soft delete queries
CREATE INDEX IF NOT EXISTS idx_tickets_deleted_at ON tickets(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create views for active (non-deleted) records
CREATE OR REPLACE VIEW active_tickets AS
SELECT * FROM tickets WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_documents AS
SELECT * FROM documents WHERE deleted_at IS NULL;

-- Create views for deleted records
CREATE OR REPLACE VIEW deleted_tickets AS
SELECT * FROM tickets WHERE deleted_at IS NOT NULL;

CREATE OR REPLACE VIEW deleted_users AS
SELECT * FROM users WHERE deleted_at IS NOT NULL;

CREATE OR REPLACE VIEW deleted_documents AS
SELECT * FROM documents WHERE deleted_at IS NOT NULL;
