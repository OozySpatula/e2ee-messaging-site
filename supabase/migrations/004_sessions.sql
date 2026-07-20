create table sessions (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references users(id)
        on delete cascade,

    token_hash text not null unique,

    expires_at timestamptz not null,

    created_at timestamptz default now()

);

grant select, insert, update, delete
on public.sessions
to service_role;