CREATE TABLE nspired_upvotes (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER
        REFERENCES nspired_goals(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES nspired_users(id) ON DELETE CASCADE NOT NULL
);