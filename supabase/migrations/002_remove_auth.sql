-- Remove RLS policies that require authentication
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create permissive policies for development (no auth required)
CREATE POLICY "Allow all select on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert on events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on events"
  ON events FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on events"
  ON events FOR DELETE
  USING (true);

-- Modify user_id to allow any text value (not just auth users)
ALTER TABLE events ALTER COLUMN user_id TYPE TEXT;
