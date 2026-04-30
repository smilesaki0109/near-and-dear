create table if not exists public.company_spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  comment text,
  image_url text,
  map_x numeric,
  map_y numeric,
  lat numeric,
  lng numeric,
  language text default 'en',
  created_by text,
  created_at timestamp with time zone default now()
);

create table if not exists public.spot_interests (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.company_spots(id) on delete cascade,
  user_key text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.company_events (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references public.company_spots(id) on delete set null,
  title text not null,
  description text,
  event_date date,
  event_time text,
  capacity integer,
  created_at timestamp with time zone default now()
);

create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.company_events(id) on delete cascade,
  user_key text not null,
  created_at timestamp with time zone default now()
);

create unique index if not exists spot_interests_spot_user_unique
  on public.spot_interests(spot_id, user_key);

create unique index if not exists event_participants_event_user_unique
  on public.event_participants(event_id, user_key);

create index if not exists company_spots_created_at_idx
  on public.company_spots(created_at desc);

create index if not exists company_events_created_at_idx
  on public.company_events(created_at desc);

notify pgrst, 'reload schema';
