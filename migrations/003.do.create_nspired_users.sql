CREATE TABLE nspired_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);

ALTER TABLE nspired_goals
  ADD COLUMN
    user_id INTEGER REFERENCES nspired_users(id)
    ON DELETE SET NULL;