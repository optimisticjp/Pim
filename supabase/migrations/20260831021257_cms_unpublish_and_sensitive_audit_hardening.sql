create or replace function private.guard_cms_publish()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='guru_profiles' then
    if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.published=true and new.published=false and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name='guru_chapters' then
    if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.status='published' and new.status<>'published' and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name='heritage_documents' then
    if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') and not private.has_permission('heritage.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.status='published' and new.status<>'published' and not private.has_permission('heritage.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name in ('media_folders','media_assets') then
    if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('media.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.published=true and new.published=false and not private.has_permission('media.publish') then raise exception 'Publish permission required'; end if;
  end if;
  return new;
end; $$;

create or replace function public.audit_admin_row_change()
returns trigger language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); entity text; entity_id text; old_safe jsonb; new_safe jsonb; redacted text[]:=array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number','body_text','attachment_url','storage_key','token_hash'];
begin
  entity:=tg_table_name;
  if tg_op='INSERT' then
    new_safe:=to_jsonb(new)-redacted; entity_id:=coalesce(new_safe->>'id',new_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,new_data) values(actor,'insert',entity,entity_id,new_safe); return new;
  elsif tg_op='UPDATE' then
    old_safe:=to_jsonb(old)-redacted; new_safe:=to_jsonb(new)-redacted; entity_id:=coalesce(new_safe->>'id',new_safe->>'role_id',old_safe->>'id',old_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,old_data,new_data) values(actor,'update',entity,entity_id,old_safe,new_safe); return new;
  else
    old_safe:=to_jsonb(old)-redacted; entity_id:=coalesce(old_safe->>'id',old_safe->>'role_id');
    insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,old_data) values(actor,'delete',entity,entity_id,old_safe); return old;
  end if;
end; $$;

create trigger audit_booking_documents after insert or update or delete on public.booking_documents for each row execute function public.audit_admin_row_change();