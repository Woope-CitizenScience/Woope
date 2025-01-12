CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.roles
(
    role_id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (role_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;

insert into roles (role_id, name) values (1,'System Admin');
insert into roles (role_id, name) values (2,'User');
insert into roles (role_id, name) values (3,'Org Admin');

-- Create Users Table
CREATE TABLE users
(
    user_id       SERIAL PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    email         VARCHAR(100) UNIQUE,
    phone_number  VARCHAR(15) UNIQUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP WITH TIME ZONE,
    -- is_Admin      BOOLEAN DEFAULT FALSE,
    refresh_token VARCHAR(255) UNIQUE,
    admins_org    INTEGER,
    role_id       INTEGER DEFAULT 2,
    CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.roles (role_id)
    -- CONSTRAINT users_admins_org_fkey FOREIGN KEY (admins_org)
        -- REFERENCES public.organizations (org_id)
);

-- Create Profile Information Table
CREATE TABLE profile_information
(
    profile_id    SERIAL PRIMARY KEY,
    user_id       INT UNIQUE REFERENCES users (user_id) ON DELETE CASCADE,
    first_name    VARCHAR(100),
    last_name     VARCHAR(100),
    date_of_birth DATE
);
