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