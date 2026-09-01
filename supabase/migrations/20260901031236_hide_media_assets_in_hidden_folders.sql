create or replace function public.list_public_media_folders()
returns table(
  id uuid,
  parent_id uuid,
  slug text,
  title_gu text,
  category text,
  description_gu text,
  sort_order integer
)
language sql
security definer
set search_path = ''
as $$
  with recursive visible_folders as (
    select f.id, f.parent_id, f.slug, f.title_gu, f.category, f.description_gu, f.sort_order
    from public.media_folders f
    where f.parent_id is null
      and f.published = true
      and f.archived_at is null

    union all

    select c.id, c.parent_id, c.slug, c.title_gu, c.category, c.description_gu, c.sort_order
    from public.media_folders c
    join visible_folders p on p.id = c.parent_id
    where c.published = true
      and c.archived_at is null
  )
  select f.id, f.parent_id, f.slug, f.title_gu, f.category, f.description_gu, f.sort_order
  from visible_folders f
  order by f.sort_order, f.title_gu;
$$;

create or replace function public.list_public_media_assets(target_folder_slug text default null)
returns table(
  id uuid,
  folder_id uuid,
  title_gu text,
  media_type text,
  asset_url text,
  thumbnail_url text,
  mime_type text,
  duration_seconds integer,
  sort_order integer
)
language sql
security definer
set search_path = ''
as $$
  with recursive visible_folders as (
    select f.id, f.parent_id, f.slug
    from public.media_folders f
    where f.parent_id is null
      and f.published = true
      and f.archived_at is null

    union all

    select c.id, c.parent_id, c.slug
    from public.media_folders c
    join visible_folders p on p.id = c.parent_id
    where c.published = true
      and c.archived_at is null
  )
  select a.id, a.folder_id, a.title_gu, a.media_type, a.asset_url, a.thumbnail_url, a.mime_type, a.duration_seconds, a.sort_order
  from public.media_assets a
  left join visible_folders f on f.id = a.folder_id
  where a.published = true
    and a.archived_at is null
    and (a.folder_id is null or f.id is not null)
    and (target_folder_slug is null or f.slug = target_folder_slug)
  order by a.sort_order, a.title_gu;
$$;