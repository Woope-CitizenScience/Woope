--Create Tables
CREATE TABLE IF NOT EXISTS organizations (
    org_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(50) NOT NULL,
    text_description VARCHAR(500),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    text_description VARCHAR(500)
);
-- organizations and category bridge table
CREATE TABLE IF NOT EXISTS organizations_category(
    org_id int NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    category_id int NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id,category_id)
);
-- orgnaizations and user bridge table
CREATE TABLE IF NOT EXISTS user_organization_follows(
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    org_id INT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, org_id)
);