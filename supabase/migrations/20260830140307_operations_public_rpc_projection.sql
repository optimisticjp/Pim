create or replace function public.list_public_ashrams()
returns table(id uuid,slug text,name_gu text,city_gu text,state_gu text,full_address text,office_phone text,map_url text,accepts_stays boolean)
language sql security definer set search_path = '' as $$
  select a.id,a.slug,a.name_gu,a.city_gu,a.state_gu,a.full_address,a.office_phone,a.map_url,a.accepts_stays
  from public.ashram_profiles a where a.published=true and a.archived_at is null order by a.name_gu;
$$;

create or replace function public.list_public_programme_centres()
returns table(id uuid,kind text,title_gu text,ashram_id uuid,address_gu text,city_gu text,contact_name text,contact_mobile text,map_url text,schedule_text text,age_range_text text)
language sql security definer set search_path = '' as $$
  select c.id,c.kind,c.title_gu,c.ashram_id,c.address_gu,c.city_gu,c.contact_name,c.contact_mobile,c.map_url,c.schedule_text,c.age_range_text
  from public.programme_centres c where c.published=true and c.archived_at is null order by c.sort_order,c.title_gu;
$$;

create or replace function public.list_public_programme_circulars()
returns table(id uuid,title_gu text,category text,description_gu text,image_url text,pdf_url text,valid_from date,valid_until date,published_at timestamptz)
language sql security definer set search_path = '' as $$
  select c.id,c.title_gu,c.category,c.description_gu,c.image_url,c.pdf_url,c.valid_from,c.valid_until,c.published_at
  from public.programme_circulars c where c.published=true and c.archived_at is null and (c.valid_until is null or c.valid_until>=current_date)
  order by coalesce(c.valid_from,current_date) desc,c.created_at desc;
$$;

create or replace function public.list_public_tithi_programmes()
returns table(id uuid,title_gu text,programme_type text,programme_date date,weekday_gu text,tithi_name_gu text,tithi_number text,swamiji_name text,village_city_gu text,venue_gu text,map_url text,details_gu text,image_url text,pdf_url text,ashram_id uuid)
language sql security definer set search_path = '' as $$
  select t.id,t.title_gu,t.programme_type,t.programme_date,t.weekday_gu,t.tithi_name_gu,t.tithi_number,t.swamiji_name,t.village_city_gu,t.venue_gu,t.map_url,t.details_gu,t.image_url,t.pdf_url,t.ashram_id
  from public.tithi_programmes t where t.status='published' and t.programme_date>=current_date order by t.programme_date;
$$;

create or replace function public.list_public_seva_categories()
returns table(id uuid,slug text,title_gu text,description_gu text,sort_order integer)
language sql security definer set search_path = '' as $$
  select c.id,c.slug,c.title_gu,c.description_gu,c.sort_order from public.seva_categories c where c.published=true and c.archived_at is null order by c.sort_order,c.title_gu;
$$;

create or replace function public.list_public_seva_activities()
returns table(id uuid,category_id uuid,title_gu text,summary_gu text,details_gu text,ashram_id uuid,activity_date date,metric_label_gu text,metric_value text,cover_url text)
language sql security definer set search_path = '' as $$
  select a.id,a.category_id,a.title_gu,a.summary_gu,a.details_gu,a.ashram_id,a.activity_date,a.metric_label_gu,a.metric_value,a.cover_url
  from public.seva_activities a where a.published=true and a.archived_at is null order by coalesce(a.activity_date,current_date) desc,a.created_at desc;
$$;

revoke all on function public.list_public_ashrams() from public;
revoke all on function public.list_public_programme_centres() from public;
revoke all on function public.list_public_programme_circulars() from public;
revoke all on function public.list_public_tithi_programmes() from public;
revoke all on function public.list_public_seva_categories() from public;
revoke all on function public.list_public_seva_activities() from public;
grant execute on function public.list_public_ashrams() to anon,authenticated;
grant execute on function public.list_public_programme_centres() to anon,authenticated;
grant execute on function public.list_public_programme_circulars() to anon,authenticated;
grant execute on function public.list_public_tithi_programmes() to anon,authenticated;
grant execute on function public.list_public_seva_categories() to anon,authenticated;
grant execute on function public.list_public_seva_activities() to anon,authenticated;
