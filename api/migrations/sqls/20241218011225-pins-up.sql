--Create Tables
CREATE TABLE IF NOT EXISTS pins (
    pin_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(100) NOT NULL, 
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    text_description VARCHAR(500),
    label VARCHAR(20),
    dateBegin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);