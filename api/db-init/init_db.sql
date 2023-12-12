-- SQL Script to create and populate a basic user table

-- Create a 'users' table
\c woope
CREATE TABLE users (
    id SERIAL PRIMARY KEY,          -- Unique identifier for each user
    first_name VARCHAR(50),         -- First name of the user
    last_name VARCHAR(50),          -- Last name of the user
    email VARCHAR(100) UNIQUE,      -- Email address of the user, unique
    password VARCHAR(255)           -- Password (should be hashed in real-world applications)
);

-- Insert some sample data into the 'users' table
INSERT INTO users (first_name, last_name, email, password) VALUES
('Alice', 'Smith', 'alice.smith@example.com', 'password123'),
('Bob', 'Johnson', 'bob.johnson@example.com', 'mypassword'),
('Carol', 'Williams', 'carol.williams@example.com', 'carolspass');
('Dakota', 'Wagner', 'wagnerdak@gmail.com', 'test123');

-- Note: In a real-world application, passwords should never be stored in plain text.
-- They should be securely hashed and salted. This example uses plain text passwords
-- for simplicity.
