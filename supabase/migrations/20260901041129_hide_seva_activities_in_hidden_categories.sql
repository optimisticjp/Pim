create or replace function public.list_public_seva_activities()
returns table(
  id uuid,
  category_id uuid,
  title_gu text,
  summary_gu text,
  details_gu text,
  ashram_id uuid,
  activity_date date,
  metric_label_gu text,
  metric_value text,
  cover_url text
)
language sql
security definer
set search_path = ''
as $function$
  select
    a.id,
    a.category_id,
    a.title_gu,
    a.summary_gu,
    a.details_gu,
    a.ashram_id,
    a.activity_date,
    a.metric_label_gu,
    a.metric_value,
    a.cover_url
  from public.seva_activities a
  join public.seva_categories c on c.id = a.category_id
  where a.published = true
    and a.archived_at is null
    and c.published = true
    and c.archived_at is null
  order by coalesce(a.activity_date, current_date) desc, a.created_at desc;
$function$;
