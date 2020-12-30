BEGIN; 

TRUNCATE 
  nspired_inspo,
  nspired_goals,
  nspired_users,
  nspired_advice,
  nspired_upvotes,
  nspired_user_goals
  RESTART IDENTITY CASCADE;

INSERT INTO nspired_inspo (inspo_quote)
VALUES
  ('Success only comes to those who dare to attempt.'),
  ('Believe you can and you''re halfway there.'),
  ('Be the change you wish to see in the world.'),
  ('Whatever you are, be a good one.'),
  ('The only limit is your imagination.'),
  ('Make your life a masterpiece.'),
  ('It does not matter how far you go, as long as you do not stop.'),
  ('All great achievements require time.'),
  ('Wherever you go, go with all your heart.'),
  ('Good timber does not grow with ease; the stronger the wind, the stronger the trees.'),
  ('We could never learn to be brave and patient if there were only joy in the world.'),
  ('If you light a lamp for somebody, it will also brighten your path.'),
  ('The world is round and the place which may seem like the end may also be the beginning.'),
  ('Today is the tomorrow you worried about yesterday.');

INSERT INTO nspired_users (user_name, full_name, password, date_created)
VALUES
  ('Jennabot5000', 'Jenna Chestnut', '$2a$04$JXMVL1PAaJlaHv7apR23Yesmsoj5wyH3FjRUR6BFzg7F4Eq3ocgc.', 
  now() - '27 days'::INTERVAL),
  ('SalemtheDog', 'Salem Chestnut',
  '$2a$04$Wi4F0gsLW10vGRdZNbUVL.YIiNxZGJvNclpozolW/8xdR9Wsp.YFW',
  now() - '10 days'::INTERVAL),
  ('Odykins', 'Otis Jackson',
  '$2a$04$GRXA/pyDfSuXUdiSZ9rQduL/Q7DAsEB2OpWb1xUgfVGFfTEfv4Wqu', 
  now() - '9 days'::INTERVAL),
  ('TheFizzicyst', 'Doctor Thunder', 
  '$2a$04$jILw8c06cs4VmFAVPLcCp.xn8Cki7gTKJtvbkE/EeqVOx2vPXhz0e', 
  now() - '7 days'::INTERVAL),
  ('nSpireMe', 'Anita Inspo', 
  '$2a$04$3qRBLtY7BxjIJiKaIzufDOANSz6mqcDwnYW4XfdDk6PKK7v2ZEERG', 
  now() - '4 days'::INTERVAL);

INSERT INTO nspired_goals (goal_name, date_created, user_id, is_public)
VALUES
  ('Become a dev', now() - '29 days'::INTERVAL, 1, TRUE),
  ('Hike a 4000 footer', now() - '14 days'::INTERVAL, 4, TRUE),
  ('Meditate daily', now() - '8 days'::INTERVAL, 3, FALSE),
  ('Catch my tail', now() - '5 days'::INTERVAL, 2, TRUE),
  ('Start a meal prep routine', now() - '2 days'::INTERVAL, 1, FALSE),
  ('Be in a musical', now(), 3, TRUE),
  ('Win a hot dog eating contest', now() - '8 days'::INTERVAL, 5, TRUE),
  ('Whistle', now() - '5 days'::INTERVAL, 2, TRUE),
  ('Build first capstone', now() - '2 days'::INTERVAL, 1, FALSE),
  ('Survive 2020', now(), 3, TRUE);

INSERT INTO nspired_advice (advice_text, goal_id, user_id)
VALUES
  ('If I can do it, you most certainly can, lol. Just divvy things up into chunks and you''ll see yourself slowly but surely getting it done!', 7, 1),
  ('It''s not all it''s cracked up to, but not much tops the feeling of being onstage and singing Mary Poppins.', 6, 1),
  ('Not sure how I did this as I do not have a tail.', 4, 4),
  ('We''re almost there! We can do this! Bork!', 10, 2),
  ('The trick is to just keep spinning as fast as you can and eventually you can catch it!!! PROMISE! Bork!', 4, 2),
  ('Press all the buttons. Don''t look back.', 1, 3),
  ('I didn''t actually accomplish this but it is nice to pretend. :-(', 8, 5),
  ('I''m already pretty tall so this wasn''t as impressive as I thought it''d be. But if you''re short, you''ll have a great time.', 2, 3),
  ('2020 is only as tough as you let it be.', 10, 3),
  ('Wait, what year is it????', 10, 4),
  ('I did it! Bring a lot of water and remember to take breaks. The views when you get to the top are absolutrely worth it!!', 2, 5),
  ('Gravity is the planet''s way of saying "You''re under arrest."', 6, 3),
  ('You can''t investigate nothing!', 1, 5),
  ('Without freedom there can be no ships.', 1, 3),
  ('A new opportunity is entertaining for everybody. Thank you.', 2, 3),
  ('Quotes give perspective an existence.', 4, 3),
  ('Never stop the chase.', 1, 4),
  ('You can make screaming surrender!', 8, 5),
  ('Do more for your friends.', 6, 3),
  ('Winter is coming.', 10, 5);


INSERT INTO nspired_upvotes (goal_id, user_id)
VALUES
  (7, 1),
  (6, 1),
  (4, 4),
  (10, 2),
  (4, 2),
  (1, 3),
  (8, 5),
  (2, 3),
  (4, 3),
  (10, 4),
  (2, 5),
  (6, 3),
  (1, 5),
  (1, 3),
  (8, 5),
  (2, 3),
  (4, 3),
  (1, 4),
  (8, 5),
  (6, 3),
  (10, 5);

INSERT INTO nspired_user_goals (goal_id, user_id, is_creator, completed, expiration, personal_note)
VALUES
  (1, 1, TRUE, FALSE, now() + '35 days'::INTERVAL, 'I always wanted to do this thing'),
  (2, 4, FALSE, TRUE, now() + '30 days'::INTERVAL, 'I always wanted to do this thing'),
  (7, 3, TRUE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (1, 3, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (8, 5, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (4, 2, TRUE, TRUE, now() + '1 days'::INTERVAL, 'I always wanted to do this thing'),
  (2, 3, TRUE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (6, 3, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (4, 5, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (8, 3, TRUE, FALSE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (6, 2, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (4, 3, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (10, 2, TRUE, TRUE, now() + '1 days'::INTERVAL, 'I always wanted to do this thing'),
    (1, 1, TRUE, FALSE, now() + '35 days'::INTERVAL, 'I always wanted to do this thing'),
  (2, 4, FALSE, TRUE, now() + '30 days'::INTERVAL, 'I always wanted to do this thing'),
  (3, 3, TRUE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (1, 3, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (8, 5, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (4, 2, TRUE, TRUE, now() + '1 days'::INTERVAL, 'I always wanted to do this thing'),
  (2, 3, TRUE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (6, 3, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (2, 5, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (8, 3, TRUE, FALSE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (6, 2, FALSE, TRUE, now() + '7 days'::INTERVAL, 'I always wanted to do this thing'),
  (4, 3, FALSE, FALSE, now() + '3 days'::INTERVAL, 'I always wanted to do this thing'),
  (10, 2, TRUE, TRUE, now() + '1 days'::INTERVAL, 'I always wanted to do this thing');

COMMIT;