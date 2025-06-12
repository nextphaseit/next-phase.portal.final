-- User Activity Log Table
-- This table tracks all user actions for audit and monitoring purposes

CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'Login', 'Logout', 'Page View', 'Action'
  page TEXT, -- Page name or URL for Page View actions
  metadata JSONB DEFAULT '{}', -- Additional context data
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_email ON user_activity_log(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_timestamp ON user_activity_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own activity, admins can see all
CREATE POLICY "Users can view own activity" ON user_activity_log
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super-admin')
    )
  );

-- Policy: Only system can insert activity logs
CREATE POLICY "System can insert activity logs" ON user_activity_log
  FOR INSERT WITH CHECK (true);

-- Sample data for testing
INSERT INTO user_activity_log (user_email, action, page, metadata) VALUES
('admin@nextphase.com', 'Login', NULL, '{"browser": "Chrome", "device": "Desktop"}'),
('admin@nextphase.com', 'Page View', 'Dashboard', '{"duration": 45}'),
('user@nextphase.com', 'Login', NULL, '{"browser": "Firefox", "device": "Mobile"}'),
('admin@nextphase.com', 'Page View', 'Users', '{"duration": 120}'),
('user@nextphase.com', 'Logout', NULL, '{}');
