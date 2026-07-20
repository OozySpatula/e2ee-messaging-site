create table friend_requests (

    id uuid primary key default gen_random_uuid(),

    sender_id uuid not null references users(id),

    receiver_id uuid not null references users(id),

    created_at timestamptz default now()

);