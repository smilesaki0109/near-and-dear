create table if not exists public.japan_map_posts (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  category text not null check (category in ('Food', 'Place', 'Culture', 'Daily Life')),
  title text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists japan_map_posts_created_at_idx
  on public.japan_map_posts (created_at desc);

insert into public.japan_map_posts (location, category, title, description, image_url)
values
  ('Niigata', 'Food', 'Onigiri', 'I love how simple and warm it feels.', null),
  ('Tokyo', 'Place', 'Old wooden houses', 'They feel peaceful and beautiful.', null),
  ('Osaka', 'Food', 'Takoyaki', 'It makes me happy with friends.', null)
on conflict do nothing;

notify pgrst, 'reload schema';
