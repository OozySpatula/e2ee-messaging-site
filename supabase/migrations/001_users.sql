-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE users (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    username TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    public_key TEXT,

    created_at TIMESTAMP WITH TIME ZONE
        DEFAULT NOW(),

    updated_at TIMESTAMP WITH TIME ZONE
        DEFAULT NOW()

);

grant select, insert, update, delete
on public.users
to service_role;
