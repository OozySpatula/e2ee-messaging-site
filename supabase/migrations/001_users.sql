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


-- Helpful for username lookups during login
CREATE INDEX users_username_index
ON users(username);