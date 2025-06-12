-- Supabase SQL for audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  performed_by text NOT NULL, -- can be user email or uuid
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb
);

-- Index for faster queries by timestamp
CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);

-- Index for filtering by user
CREATE INDEX idx_audit_logs_performed_by ON audit_logs (performed_by);

-- Index for filtering by action
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
