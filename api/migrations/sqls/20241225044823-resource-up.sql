/* create resource table */
CREATE TABLE IF NOT EXISTS resource (
    resource_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    text_description VARCHAR(500) DEFAULT '',
    tagline VARCHAR(50) DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Create media_type Table
CREATE TABLE IF NOT EXISTS resource_media (
    media_id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    media_type media_type_enum NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resource(resource_id) ON DELETE CASCADE
);
