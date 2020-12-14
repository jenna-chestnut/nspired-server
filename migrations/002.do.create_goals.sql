CREATE TABLE nspired_goals (
  id SERIAL PRIMARY KEY,
  goal_name TEXT,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
