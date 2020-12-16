INSERT INTO nspired_goals (goal_name, date_created, user_id)
VALUES
  ('Become a dev', now() - '29 days'::INTERVAL, 1),
  ('Hike a 4000 footer', now() - '14 days'::INTERVAL, 4),
  ('Meditate daily', now() - '8 days'::INTERVAL, 5),
  ('Catch my tail', now() - '5 days'::INTERVAL, 2),
  ('Start a meal prep routine', now() - '2 days'::INTERVAL, 1),
  ('Be in a musical', now(), 3);