do $$
declare
  has_lat boolean;
  has_lng boolean;
begin
  if to_regclass('public.map_posts') is null then
    return;
  end if;

  alter table public.map_posts
    add column if not exists x double precision,
    add column if not exists y double precision;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'map_posts' and column_name = 'lat'
  ) into has_lat;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'map_posts' and column_name = 'lng'
  ) into has_lng;

  if has_lat and has_lng then
    execute $sql$
      update public.map_posts
      set
        x = coalesce(x, case
          when lng is null then 50
          else least(100, greatest(0, ((lng - 122) / 32) * 100))
        end),
        y = coalesce(y, case
          when lat is null then 50
          else least(100, greatest(0, ((47 - lat) / 27) * 100))
        end)
    $sql$;

    alter table public.map_posts
      drop column if exists lat,
      drop column if exists lng;
  else
    update public.map_posts
    set
      x = coalesce(x, 50),
      y = coalesce(y, 50);
  end if;

  alter table public.map_posts
    alter column x set not null,
    alter column y set not null;

  alter table public.map_posts
    drop column if exists lat,
    drop column if exists lng;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'map_posts_x_range'
  ) then
    alter table public.map_posts
      add constraint map_posts_x_range check (x >= 0 and x <= 100);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'map_posts_y_range'
  ) then
    alter table public.map_posts
      add constraint map_posts_y_range check (y >= 0 and y <= 100);
  end if;
end $$;

notify pgrst, 'reload schema';
