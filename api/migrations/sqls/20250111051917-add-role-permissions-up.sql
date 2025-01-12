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

