CREATE TABLE IF NOT EXISTS public.activity
(
    id integer NOT NULL DEFAULT nextval('activity_id_seq'::regclass),
    user_id integer,
    description text COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT activity_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)
