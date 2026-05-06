-- Migration: Update sex constraint and add streak tracking
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_sex_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_sex_check 
CHECK (sex IN ('male', 'female', 'other'));

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_log_date date;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_log DATE;
    current_s INTEGER;
BEGIN
    -- Get current profile info
    SELECT current_streak, last_log_date INTO current_s, last_log 
    FROM user_profiles WHERE id = NEW.user_id;

    -- Only update if it's a new day
    IF last_log IS NULL OR last_log < CURRENT_DATE THEN
        -- If logged yesterday, increment streak
        IF last_log = (CURRENT_DATE - INTERVAL '1 day')::DATE THEN
            UPDATE user_profiles 
            SET current_streak = COALESCE(current_streak, 0) + 1,
                last_log_date = CURRENT_DATE,
                longest_streak = GREATEST(COALESCE(longest_streak, 0), COALESCE(current_streak, 0) + 1)
            WHERE id = NEW.user_id;
        ELSE
            -- Missed a day (or first time), reset to 1
            UPDATE user_profiles 
            SET current_streak = 1,
                last_log_date = CURRENT_DATE,
                longest_streak = GREATEST(COALESCE(longest_streak, 0), 1)
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on meals table
DROP TRIGGER IF EXISTS on_meal_log_update_streak ON meals;
CREATE TRIGGER on_meal_log_update_streak
AFTER INSERT ON meals
FOR EACH ROW
EXECUTE FUNCTION update_user_streak();
