create or replace function private.notify_admins_on_inbox_arrival()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  notice_title text;
begin
  notice_title := case new.category
    when 'membership' then 'નવી સભ્યપદ અરજી'
    when 'volunteer' then 'નવી સ્વયંસેવક અરજી'
    when 'room_booking' then 'નવી ઉતારા વિનંતી'
    when 'donation' then 'નવી દાન / ભેટ નોંધ'
    when 'veda_rahasya' then 'નવી વેદ રહસ્ય સભ્યપદ અરજી'
    when 'address_change' then 'નવી વેદ રહસ્ય સુધારો વિનંતી'
    when 'article_submission' then 'નવી વેદ રહસ્ય લેખ રજૂઆત'
    when 'contact' then 'નવો સંપર્ક સંદેશ'
    when 'participation' then 'નવી સહભાગિતા નોંધ'
    when 'manual' then 'નવી ઇનબોક્સ નોંધ'
    else 'નવી ઇનબોક્સ અરજી'
  end;

  insert into public.notifications(admin_id, type, title, body, href, payload)
  select distinct
    ap.id,
    'inbox.new',
    notice_title,
    case when new.ashram_key is null then null else 'આશ્રમ: ' || new.ashram_key end,
    '/admin/inbox',
    jsonb_build_object(
      'inbox_item_id', new.id,
      'category', new.category,
      'ashram_key', new.ashram_key
    )
  from public.admin_profiles ap
  where ap.status = 'active'
    and (
      ap.is_super_admin
      or exists (
        select 1
        from public.admin_role_assignments ara
        join public.roles r on r.id = ara.role_id and r.is_archived = false
        join public.role_permissions rp on rp.role_id = r.id
        where ara.admin_id = ap.id
          and rp.permission_code = 'inbox.view'
          and (
            ara.scope_type = 'global'
            or (
              new.ashram_key is not null
              and ara.scope_type = 'ashram'
              and ara.scope_key = new.ashram_key
            )
          )
      )
    );

  return new;
end;
$$;

revoke all on function private.notify_admins_on_inbox_arrival() from public;
revoke all on function private.notify_admins_on_inbox_arrival() from anon;
revoke all on function private.notify_admins_on_inbox_arrival() from authenticated;

drop trigger if exists inbox_items_notify_admins on public.inbox_items;
create trigger inbox_items_notify_admins
after insert on public.inbox_items
for each row execute function private.notify_admins_on_inbox_arrival();
