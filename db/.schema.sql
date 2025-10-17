create table if not exists public.contacts (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text,
  notes text,
  created_at timestamptz default now()
);
