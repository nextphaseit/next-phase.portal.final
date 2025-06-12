-- System Settings Table
-- For storing system-wide configuration

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only super-admins can manage system settings
CREATE POLICY "Super admins can manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super-admin'
    )
  );

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, description, created_by) VALUES
('maintenance_mode', '{"enabled": false, "message": "System is currently under maintenance. Please check back later.", "scheduled_end": null}', 'Maintenance mode configuration', 'system'),
('portal_theme', '{"default_theme": "light", "allow_user_theme": true}', 'Portal theme settings', 'system'),
('notification_settings', '{"email_enabled": true, "in_app_enabled": true, "retention_days": 30}', 'Notification configuration', 'system')
ON CONFLICT (setting_key) DO NOTHING;
