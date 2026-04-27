create table if not exists public.map_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('food', 'place', 'culture', 'daily_life')),
  x double precision not null check (x >= 0 and x <= 100),
  y double precision not null check (y >= 0 and y <= 100),
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists map_posts_created_at_idx
  on public.map_posts (created_at desc);

create index if not exists map_posts_category_idx
  on public.map_posts (category);

insert into public.map_posts (title, description, category, x, y, image_url)
values
  ('Seafood in Sapporo', 'The seafood here is amazing!', 'food', 77, 20, null),
  ('Ramen shops in Tokyo', 'Warm bowls after work make me happy.', 'food', 67, 47, null),
  ('Kyoto temples', 'Beautiful temples and gardens.', 'culture', 50, 58, null),
  ('Takoyaki in Osaka', 'My comfort food with friends.', 'food', 46, 64, null)
on conflict do nothing;

notify pgrst, 'reload schema';
