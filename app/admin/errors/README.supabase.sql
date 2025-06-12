-- Frontend Errors Table (Optional)
-- For storing frontend error logs

CREATE TABLE IF NOT EXISTS frontend_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  user_email TEXT,
  user_agent TEXT,
  url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_frontend_errors_timestamp ON frontend_errors(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_frontend_errors_severity ON frontend_errors(severity);
CREATE INDEX IF NOT EXISTS idx_frontend_errors_component ON frontend_errors(component_name);
CREATE INDEX IF NOT EXISTS idx_frontend_errors_resolved ON frontend_errors(resolved) WHERE resolved = false;

-- Enable RLS
ALTER TABLE frontend_errors ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view errors
CREATE POLICY "Admins can view errors" ON frontend_errors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super-admin')
    )
  );

-- Policy: Anyone can insert errors (for error reporting)
CREATE POLICY "Anyone can insert errors" ON frontend_errors
  FOR INSERT WITH CHECK (true);

-- Policy: Only admins can update errors (for marking as resolved)
CREATE POLICY "Admins can update errors" ON frontend_errors
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super-admin')
    )
  );
