CREATE TABLE nspired_user_goals (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER
        REFERENCES nspired_goals(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES nspired_users(id) ON DELETE CASCADE NOT NULL
    is_creator BOOLEAN default false,
    completed BOOLEAN default false,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    expiration TIMESTAMPTZ NOT NULL
);