CREATE TABLE IF NOT EXISTS public.roles
(
    role_id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (role_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;

INSERT INTO roles (role_id, name) VALUES (1,'System Admin');
INSERT INTO roles (role_id, name) VALUES (2,'User');
INSERT INTO roles (role_id, name) VALUES (3,'Org Admin');

CREATE TABLE IF NOT EXISTS public.permissions
(
    permission_id SERIAL,
    name character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT permissions_pkey PRIMARY KEY (permission_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.permissions
    OWNER to postgres;

INSERT INTO public.permissions(permission_id, name)
	VALUES (1, 'delete_all_posts');

INSERT INTO public.permissions(permission_id, name)
	VALUES (2, 'edit_all_posts');

INSERT INTO public.permissions(permission_id, name)
	VALUES (3, 'edit_all_organizations');

INSERT INTO public.permissions(permission_id, name)
	VALUES (4, 'create_org_posts');

INSERT INTO public.permissions(permission_id, name)
	VALUES (5, 'edit_org_posts');

INSERT INTO public.permissions(permission_id, name)
	VALUES (6, 'delete_org_posts');


CREATE TABLE IF NOT EXISTS public.role_permissions
(
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
    CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id)
        REFERENCES public.permissions (permission_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT role_permissions_permission_id_fkey1 FOREIGN KEY (permission_id)
        REFERENCES public.permissions (permission_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES public.roles (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT role_permissions_role_id_fkey1 FOREIGN KEY (role_id)
        REFERENCES public.roles (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role_permissions
    OWNER to postgres;

insert into role_permissions(role_id, permission_id)
	values(1,1);

insert into role_permissions(role_id, permission_id)
	values(1,2);

insert into role_permissions(role_id, permission_id)
	values(1,3);

insert into role_permissions(role_id, permission_id)
	values(1,4);

insert into role_permissions(role_id, permission_id)
	values(1,5);

insert into role_permissions(role_id, permission_id)
	values(1,6);

insert into role_permissions(role_id, permission_id)
	values(3,4);

insert into role_permissions(role_id, permission_id)
	values(3,5);

insert into role_permissions(role_id, permission_id)
	values(3,6);

ALTER TABLE IF EXISTS users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
;

