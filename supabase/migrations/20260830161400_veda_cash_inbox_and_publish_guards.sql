create or replace function private.veda_cash_inbox_insert()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='donation_intents' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,ashram_key,status,priority,payload)
    select 'donation_intent',new.id::text,'donation','દાન / ભેટ '||new.intent_number,coalesce(new.purpose_gu,'નકદ સહયોગ'),new.donor_name,new.mobile,a.slug,'cash_pending','normal',jsonb_build_object('intent_number',new.intent_number,'pledged_amount',new.pledged_amount)
    from (select new.preferred_ashram_id as id) x left join public.ashram_profiles a on a.id=x.id;
  elsif tg_table_name='veda_subscription_applications' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,status,priority,payload)
    values('veda_subscription',new.id::text,'veda_rahasya','વેદ રહસ્ય સભ્યપદ '||new.application_number,coalesce(new.village,''),new.full_name,new.mobile,'new','normal',jsonb_build_object('application_number',new.application_number));
  elsif tg_table_name='veda_subscriber_change_requests' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_mobile,status,priority,payload)
    values('veda_change_request',new.id::text,'address_change','વેદ રહસ્ય સુધારો '||new.request_number,new.change_type,new.mobile,'new','normal',jsonb_build_object('request_number',new.request_number,'subscriber_number',new.subscriber_number));
  elsif tg_table_name='veda_article_submissions' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,status,priority,payload)
    values('veda_article',new.id::text,'article_submission','વેદ રહસ્ય લેખ '||new.submission_number,new.title,new.author_name,new.mobile,'new','normal',jsonb_build_object('submission_number',new.submission_number));
  end if;
  return new;
end; $$;

create or replace function private.veda_cash_inbox_status()
returns trigger language plpgsql security definer set search_path='' as $$
declare mapped_status text;
begin
  if new.status is distinct from old.status then
    mapped_status:=case new.status when 'submitted' then 'new' when 'under_review' then 'reviewing' when 'changes_requested' then 'pending' else new.status end;
    if tg_table_name='donation_intents' then
      update public.inbox_items set status=mapped_status,assigned_to=coalesce(assigned_to,new.assigned_to) where source_type='donation_intent' and source_id=new.id::text;
    elsif tg_table_name='veda_subscription_applications' then
      update public.inbox_items set status=mapped_status,assigned_to=coalesce(assigned_to,new.reviewed_by) where source_type='veda_subscription' and source_id=new.id::text;
    elsif tg_table_name='veda_subscriber_change_requests' then
      update public.inbox_items set status=mapped_status,assigned_to=coalesce(assigned_to,new.reviewed_by) where source_type='veda_change_request' and source_id=new.id::text;
    elsif tg_table_name='veda_article_submissions' then
      update public.inbox_items set status=mapped_status,assigned_to=coalesce(assigned_to,new.reviewed_by) where source_type='veda_article' and source_id=new.id::text;
    end if;
  end if;
  return new;
end; $$;

create trigger donation_create_inbox after insert on public.donation_intents for each row execute function private.veda_cash_inbox_insert();
create trigger donation_sync_inbox after update of status on public.donation_intents for each row execute function private.veda_cash_inbox_status();
create trigger veda_subscription_create_inbox after insert on public.veda_subscription_applications for each row execute function private.veda_cash_inbox_insert();
create trigger veda_subscription_sync_inbox after update of status on public.veda_subscription_applications for each row execute function private.veda_cash_inbox_status();
create trigger veda_change_create_inbox after insert on public.veda_subscriber_change_requests for each row execute function private.veda_cash_inbox_insert();
create trigger veda_change_sync_inbox after update of status on public.veda_subscriber_change_requests for each row execute function private.veda_cash_inbox_status();
create trigger veda_article_create_inbox after insert on public.veda_article_submissions for each row execute function private.veda_cash_inbox_insert();
create trigger veda_article_sync_inbox after update of status on public.veda_article_submissions for each row execute function private.veda_cash_inbox_status();

create or replace function private.guard_veda_issue_publish()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('veda.issues.publish') then raise exception 'Publish permission required'; end if;
  if tg_op='UPDATE' and old.published=true and new.published=false and not private.has_permission('veda.issues.publish') then raise exception 'Publish permission required'; end if;
  return new;
end; $$;
revoke all on function private.veda_cash_inbox_insert(),private.veda_cash_inbox_status(),private.guard_veda_issue_publish() from public,anon,authenticated;
create trigger veda_issues_publish_guard before insert or update on public.veda_issues for each row execute function private.guard_veda_issue_publish();

create or replace function public.audit_admin_row_change()
returns trigger language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); entity text; entity_id text; old_safe jsonb; new_safe jsonb; redacted text[]:=array['payload','mobile','primary_mobile','full_address','address','blood_group','pan_number','body_text','attachment_url','storage_key'];
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
revoke execute on function public.audit_admin_row_change() from public,anon,authenticated;
