/* Create event table */
CREATE TABLE IF NOT EXISTS event (
    event_id SERIAL PRIMARY KEY,
    org_id INTEGER NOT NULL,
    name VARCHAR(25) NOT NULL,
    text_description VARCHAR(500) DEFAULT '',
    tagline VARCHAR(50) DEFAULT '',
    time_begin TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    image_path VARCHAR(500),
    location VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);