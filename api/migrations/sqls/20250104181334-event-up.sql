/* Create event table */
CREATE TABLE IF NOT EXISTS event (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    text_description VARCHAR(500) DEFAULT '',
    tagline VARCHAR(50) DEFAULT '',
    time_begin TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    location VARCHAR(50),
    is_active boolean NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);