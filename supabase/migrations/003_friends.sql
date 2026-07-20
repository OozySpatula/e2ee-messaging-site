create table friends (

    id uuid primary key default gen_random_uuid(),

    user1_id uuid not null
        constraint friends_user1_id_fkey
        references users(id),

    user2_id uuid not null
        constraint friends_user2_id_fkey
        references users(id),

    created_at timestamptz default now()

);

grant select, insert, update, delete
on public.friends
to service_role;