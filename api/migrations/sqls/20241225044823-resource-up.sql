/* create resource table */
CREATE TABLE IF NOT EXISTS resource (
    resource_id SERIAL PRIMARY KEY,
    org_id INTEGER NOT NULL,
    name VARCHAR(20) NOT NULL,
    text_description VARCHAR(500) DEFAULT '',
    tagline VARCHAR(50) DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(500),
    FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE
);
-- Create media_type Table
CREATE TABLE IF NOT EXISTS resource_media (
    media_id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL, 
    name VARCHAR(20) NOT NULL,
    type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resource(resource_id) ON DELETE CASCADE
);