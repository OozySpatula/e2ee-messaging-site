create table friends (

    id uuid primary key default gen_random_uuid(),

    user1_id uuid not null references users(id),

    user2_id uuid not null references users(id),

    created_at timestamptz default now()

);