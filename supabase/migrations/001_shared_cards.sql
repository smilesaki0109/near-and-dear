create table if not exists public.shared_cards (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  card_id text not null,
  message text,
  locale text not null default 'en' check (locale in ('en', 'ja')),
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists shared_cards_token_idx on public.shared_cards (token);

insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
