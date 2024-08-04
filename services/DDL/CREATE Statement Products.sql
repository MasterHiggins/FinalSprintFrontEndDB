-- Table: public.products

-- DROP TABLE IF EXISTS public.products;

CREATE TABLE IF NOT EXISTS public.products
(
    product_id integer NOT NULL DEFAULT nextval('products_product_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    price numeric(10,2),
    category character varying(255) COLLATE pg_catalog."default",
    stock integer,
    on_sale boolean NOT NULL DEFAULT false,
    hit_count integer DEFAULT 0,
    CONSTRAINT products_pkey PRIMARY KEY (product_id),
    CONSTRAINT products_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER to postgres;