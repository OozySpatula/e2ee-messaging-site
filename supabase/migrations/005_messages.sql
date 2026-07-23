create table messages (

    id uuid primary key default gen_random_uuid(),

    sender_id uuid not null references users(id),

    receiver_id uuid not null references users(id),

    ciphertext text not null,

    sent_at timestamptz default now()

);

grant select, insert
on public.messages
to service_role;