CREATE TABLE nspired_advice (
    id SERIAL PRIMARY KEY,
    advice_text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    goal_id INTEGER
        REFERENCES nspired_goals(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES nspired_users(id) ON DELETE CASCADE NOT NULL
);
