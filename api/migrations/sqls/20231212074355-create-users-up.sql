CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE users
(
    user_id       SERIAL PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    email         VARCHAR(100) UNIQUE,
    phone_number  VARCHAR(15) UNIQUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP WITH TIME ZONE,
    is_Admin      BOOLEAN DEFAULT FALSE,
    refresh_token VARCHAR(255) UNIQUE
);

-- Create Profile Information Table
CREATE TABLE profile_information
(
    profile_id    SERIAL PRIMARY KEY,
    user_id       INT UNIQUE REFERENCES users (user_id),
    first_name    VARCHAR(100),
    last_name     VARCHAR(100),
    date_of_birth DATE
);
