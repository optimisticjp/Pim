drop policy if exists audit_insert on public.audit_logs;
revoke insert, update, delete on public.audit_logs from authenticated;

create or replace function public.audit_admin_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  entity text;
  entity_id text;
  old_safe jsonb;
  new_safe jsonb;
begin
  entity := tg_table_name;
  if tg_op = 'INSERT' then
    new_safe := to_jsonb(new) - 'payload' - 'mobile';
    entity_id := coalesce(new_safe ->> 'id', new_safe ->> 'role_id');
    insert into public.audit_logs(actor_user_id, action, entity_type, entity_id, new_data)
      values (actor, 'insert', entity, entity_id, new_safe);
    return new;
  elsif tg_op = 'UPDATE' then
    old_safe := to_jsonb(old) - 'payload' - 'mobile';
    new_safe := to_jsonb(new) - 'payload' - 'mobile';
    entity_id := coalesce(new_safe ->> 'id', new_safe ->> 'role_id', old_safe ->> 'id', old_safe ->> 'role_id');
    insert into public.audit_logs(actor_user_id, action, entity_type, entity_id, old_data, new_data)
      values (actor, 'update', entity, entity_id, old_safe, new_safe);
    return new;
  else
    old_safe := to_jsonb(old) - 'payload' - 'mobile';
    entity_id := coalesce(old_safe ->> 'id', old_safe ->> 'role_id');
    insert into public.audit_logs(actor_user_id, action, entity_type, entity_id, old_data)
      values (actor, 'delete', entity, entity_id, old_safe);
    return old;
  end if;
end;
$$;

revoke execute on function public.audit_admin_row_change() from public, anon, authenticated;

drop trigger if exists audit_admin_profiles on public.admin_profiles;
create trigger audit_admin_profiles after insert or update or delete on public.admin_profiles for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_roles on public.roles;
create trigger audit_roles after insert or update or delete on public.roles for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_role_permissions on public.role_permissions;
create trigger audit_role_permissions after insert or update or delete on public.role_permissions for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_admin_role_assignments on public.admin_role_assignments;
create trigger audit_admin_role_assignments after insert or update or delete on public.admin_role_assignments for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_inbox_items on public.inbox_items;
create trigger audit_inbox_items after insert or update or delete on public.inbox_items for each row execute function public.audit_admin_row_change();
