-- Table: public.search_logs

-- DROP TABLE IF EXISTS public.search_logs;

CREATE TABLE IF NOT EXISTS public.search_logs
(
    id integer NOT NULL DEFAULT nextval('search_logs_id_seq'::regclass),
    user_id integer,
    query text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_source character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT search_logs_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.search_logs
    OWNER to postgres;