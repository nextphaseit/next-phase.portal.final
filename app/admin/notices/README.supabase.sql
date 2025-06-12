-- Admin Notices Table
-- For displaying important notices to admin users

CREATE TABLE IF NOT EXISTS admin_notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_active BOOLEAN DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5), -- 1 = low, 5 = critical
  target_roles TEXT[] DEFAULT ARRAY['admin', 'super-admin'] -- Which roles should see this notice
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_notices_active ON admin_notices(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_admin_notices_created_at ON admin_notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notices_priority ON admin_notices(priority DESC);

-- Enable RLS
ALTER TABLE admin_notices ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view notices
CREATE POLICY "Admins can view notices" ON admin_notices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super-admin')
    )
  );

-- Policy: Only admins can manage notices
CREATE POLICY "Admins can manage notices" ON admin_notices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super-admin')
    )
  );

-- Sample notices
INSERT INTO admin_notices (title, message, type, created_by, priority) VALUES
('System Maintenance Scheduled', 'Scheduled maintenance window on Sunday 2AM-4AM EST', 'warning', 'system@nextphase.com', 3),
('New Feature Released', 'User Activity Logging is now available in the admin panel', 'success', 'admin@nextphase.com', 2),
('Security Update', 'Please review the new audit log features for compliance', 'info', 'admin@nextphase.com', 2);
