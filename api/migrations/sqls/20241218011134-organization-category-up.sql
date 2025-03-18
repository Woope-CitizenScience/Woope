--Create Tables
CREATE TABLE IF NOT EXISTS organizations (
    org_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tagline VARCHAR(50) DEFAULT '',
    text_description VARCHAR(500) DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(500)
);
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
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
    org_id INT NOT NULL REFERENCES organizations(org_id),
    PRIMARY KEY (user_id, org_id)
);
-- populating categories with values
INSERT INTO category (name) VALUES ('Activism'),('Food'), ('Health'), ('Mutual Aid'), ('Social');

-- Add foreign key in user table to organization table
ALTER TABLE IF EXISTS users
    ADD CONSTRAINT users_admins_org_fkey FOREIGN KEY (admins_org)
        REFERENCES public.organizations (org_id)
;

-- Add foreign key in posts table to org table
ALTER TABLE IF EXISTS posts
    ADD CONSTRAINT post_org_id_fkey FOREIGN KEY (org_id) 
        REFERENCES organizations(org_id)
;  

-- Add foreign key in comments table to org table
ALTER TABLE IF EXISTS comments
    ADD CONSTRAINT comments_org_id_fkey FOREIGN KEY (org_id) 
        REFERENCES organizations(org_id)
;
