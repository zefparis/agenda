-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('event', 'task', 'reminder')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  location TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);
