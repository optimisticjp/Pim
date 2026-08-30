create or replace function public.audit_admin_row_change()
returns trigger language plpgsql security definer set search_path=''
as $$
declare actor uuid:=auth.uid(); entity text; entity_id text; old_safe jsonb; new_safe jsonb;
begin
  entity:=tg_table_name;
  if tg_op='INSERT' then
    new_safe:=to_jsonb(new)-array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number'];
    entity_id:=coalesce(new_safe->>'id',new_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,new_data) values(actor,'insert',entity,entity_id,new_safe);
    return new;
  elsif tg_op='UPDATE' then
    old_safe:=to_jsonb(old)-array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number'];
    new_safe:=to_jsonb(new)-array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number'];
    entity_id:=coalesce(new_safe->>'id',new_safe->>'role_id',old_safe->>'id',old_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,old_data,new_data) values(actor,'update',entity,entity_id,old_safe,new_safe);
    return new;
  else
    old_safe:=to_jsonb(old)-array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number'];
    entity_id:=coalesce(old_safe->>'id',old_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,old_data) values(actor,'delete',entity,entity_id,old_safe);
    return old;
  end if;
end;
$$;

drop trigger if exists audit_membership_applications on public.membership_applications;
create trigger audit_membership_applications after insert or update or delete on public.membership_applications for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_households on public.households;
create trigger audit_households after insert or update or delete on public.households for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_people on public.people;
create trigger audit_people after insert or update or delete on public.people for each row execute function public.audit_admin_row_change();
drop trigger if exists audit_memberships on public.memberships;
create trigger audit_memberships after insert or update or delete on public.memberships for each row execute function public.audit_admin_row_change();
