create table if not exists public.operational_settings (
  id smallint primary key default 1 check (id = 1),
  booking_document_retention_days smallint not null default 7 check (booking_document_retention_days between 1 and 90),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.operational_settings(id, booking_document_retention_days)
values (1, 7)
on conflict (id) do nothing;

alter table public.operational_settings enable row level security;
revoke all on table public.operational_settings from public, anon, authenticated;
grant select, update on table public.operational_settings to authenticated;
grant all on table public.operational_settings to service_role;

drop policy if exists operational_settings_super_admin_select on public.operational_settings;
create policy operational_settings_super_admin_select on public.operational_settings
for select to authenticated using (private.is_super_admin());
drop policy if exists operational_settings_super_admin_update on public.operational_settings;
create policy operational_settings_super_admin_update on public.operational_settings
for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());

create table if not exists public.ops_maintenance_runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('document_cleanup')),
  status text not null check (status in ('running','success','partial','failed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  processed_count integer not null default 0 check (processed_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  note text
);

alter table public.ops_maintenance_runs enable row level security;
revoke all on table public.ops_maintenance_runs from public, anon, authenticated;
grant select on table public.ops_maintenance_runs to authenticated;
grant all on table public.ops_maintenance_runs to service_role;

drop policy if exists ops_maintenance_runs_super_admin_select on public.ops_maintenance_runs;
create policy ops_maintenance_runs_super_admin_select on public.ops_maintenance_runs
for select to authenticated using (private.is_super_admin());

alter table public.booking_documents
  add column if not exists deletion_reason text;

create index if not exists booking_documents_retention_due_idx
  on public.booking_documents(delete_after)
  where deleted_at is null and delete_after is not null;

create or replace function private.schedule_booking_document_retention()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare retention_days integer;
begin
  select booking_document_retention_days into retention_days
  from public.operational_settings where id = 1;
  retention_days := coalesce(retention_days, 7);

  if new.status = 'checked_out' and old.status is distinct from new.status then
    update public.booking_documents
      set delete_after = coalesce(delete_after, now() + make_interval(days => retention_days))
      where stay_request_id = new.id and deleted_at is null;
    update public.booking_document_upload_tokens
      set revoked_at = coalesce(revoked_at, now())
      where stay_request_id = new.id and revoked_at is null;
  elsif old.status = 'checked_out' and new.status is distinct from 'checked_out' then
    update public.booking_documents
      set delete_after = null
      where stay_request_id = new.id and deleted_at is null;
  end if;
  return new;
end;
$$;

revoke all on function private.schedule_booking_document_retention() from public, anon, authenticated;

drop trigger if exists stay_schedule_document_retention on public.stay_requests;
create trigger stay_schedule_document_retention
after update of status on public.stay_requests
for each row execute function private.schedule_booking_document_retention();

update public.booking_documents d
set delete_after = now() + make_interval(days => s.booking_document_retention_days)
from public.stay_requests r
cross join public.operational_settings s
where d.stay_request_id = r.id
  and r.status = 'checked_out'
  and d.deleted_at is null
  and d.delete_after is null
  and s.id = 1;

create or replace function public.update_booking_document_retention_days(target_days integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_super_admin() then raise exception 'Super Admin required'; end if;
  if target_days < 1 or target_days > 90 then raise exception 'Retention days must be between 1 and 90'; end if;
  update public.operational_settings
    set booking_document_retention_days = target_days,
        updated_at = now(),
        updated_by = auth.uid()
    where id = 1;
  return target_days;
end;
$$;
revoke execute on function public.update_booking_document_retention_days(integer) from public, anon;
grant execute on function public.update_booking_document_retention_days(integer) to authenticated;

create or replace function public.get_production_ops_status()
returns table(
  retention_days integer,
  scheduled_documents bigint,
  expired_documents bigint,
  last_cleanup_at timestamptz,
  last_cleanup_status text,
  last_cleanup_processed integer,
  last_cleanup_failed integer
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_super_admin() then raise exception 'Super Admin required'; end if;
  return query
  select
    s.booking_document_retention_days::integer,
    (select count(*) from public.booking_documents d where d.deleted_at is null and d.delete_after is not null),
    (select count(*) from public.booking_documents d where d.deleted_at is null and d.delete_after is not null and d.delete_after <= now()),
    r.completed_at,
    r.status,
    r.processed_count,
    r.failed_count
  from public.operational_settings s
  left join lateral (
    select m.completed_at,m.status,m.processed_count,m.failed_count
    from public.ops_maintenance_runs m
    where m.kind='document_cleanup'
    order by m.started_at desc limit 1
  ) r on true
  where s.id=1;
end;
$$;
revoke execute on function public.get_production_ops_status() from public, anon;
grant execute on function public.get_production_ops_status() to authenticated;
