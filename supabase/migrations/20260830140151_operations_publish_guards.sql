create or replace function private.guard_operational_publish()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name in ('programme_centres','programme_circulars') then
    if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('programmes.publish') then raise exception 'Publish permission required'; end if;
    if new.published=false and tg_op='UPDATE' and old.published=true and not private.has_permission('programmes.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name='tithi_programmes' then
    if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') and not private.has_permission('events.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.status='published' and new.status<>'published' and not private.has_permission('events.publish') then raise exception 'Publish permission required'; end if;
  end if;
  return new;
end; $$;

revoke all on function private.guard_operational_publish() from public,anon,authenticated;
create trigger programme_centres_publish_guard before insert or update on public.programme_centres for each row execute function private.guard_operational_publish();
create trigger programme_circulars_publish_guard before insert or update on public.programme_circulars for each row execute function private.guard_operational_publish();
create trigger tithi_programmes_publish_guard before insert or update on public.tithi_programmes for each row execute function private.guard_operational_publish();
