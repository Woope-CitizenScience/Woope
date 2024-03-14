CREATE TABLE events (
    event_id SERIAL,
    user_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    location VARCHAR(300),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN default TRUE,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- change location to location_id (foreign key)
-- postGIS for map feature