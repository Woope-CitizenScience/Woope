-- Create Pins Table
CREATE TABLE IF NOT EXISTS pins (
    pin_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    longitude INTEGER NOT NULL,
    latitude INTEGER NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);