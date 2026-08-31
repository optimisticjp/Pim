insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('veda.issues.publish','veda','issues_publish','વેદ રહસ્ય અંક પ્રકાશિત','વેદ રહસ્ય PDF અંક જાહેર કરવાની મંજૂરી',true)
on conflict(code) do nothing;
with pairs(role_code,permission_code) as (values ('committee_admin','veda.issues.publish'))
insert into public.role_permissions(role_id,permission_code) select r.id,p.permission_code from pairs p join public.roles r on r.code=p.role_code on conflict do nothing;

alter table public.veda_subscription_applications enable row level security;
alter table public.veda_subscribers enable row level security;
alter table public.veda_sensitive_data enable row level security;
alter table public.veda_subscriber_change_requests enable row level security;
alter table public.veda_article_submissions enable row level security;
alter table public.veda_issues enable row level security;
create policy veda_apps_select on public.veda_subscription_applications for select to authenticated using(private.has_permission('veda.view'));
create policy veda_apps_update on public.veda_subscription_applications for update to authenticated using(private.has_permission('veda.subscriptions.manage')) with check(private.has_permission('veda.subscriptions.manage'));
create policy veda_apps_super_delete on public.veda_subscription_applications for delete to authenticated using(private.is_super_admin());
create policy veda_subscribers_select on public.veda_subscribers for select to authenticated using(private.has_permission('veda.view'));
create policy veda_subscribers_insert on public.veda_subscribers for insert to authenticated with check(private.has_permission('veda.approve'));
create policy veda_subscribers_update on public.veda_subscribers for update to authenticated using(private.has_permission('veda.subscriptions.manage')) with check(private.has_permission('veda.subscriptions.manage'));
create policy veda_subscribers_super_delete on public.veda_subscribers for delete to authenticated using(private.is_super_admin());
create policy veda_sensitive_select on public.veda_sensitive_data for select to authenticated using(private.has_permission('sensitive_docs.view'));
create policy veda_sensitive_update on public.veda_sensitive_data for update to authenticated using(private.has_permission('sensitive_docs.view')) with check(private.has_permission('sensitive_docs.view'));
create policy veda_sensitive_super_delete on public.veda_sensitive_data for delete to authenticated using(private.is_super_admin());
create policy veda_changes_select on public.veda_subscriber_change_requests for select to authenticated using(private.has_permission('veda.view'));
create policy veda_changes_update on public.veda_subscriber_change_requests for update to authenticated using(private.has_permission('veda.subscriptions.manage')) with check(private.has_permission('veda.subscriptions.manage'));
create policy veda_changes_super_delete on public.veda_subscriber_change_requests for delete to authenticated using(private.is_super_admin());
create policy veda_articles_select on public.veda_article_submissions for select to authenticated using(private.has_permission('veda.view'));
create policy veda_articles_update on public.veda_article_submissions for update to authenticated using(private.has_permission('veda.editorial.manage')) with check(private.has_permission('veda.editorial.manage'));
create policy veda_articles_super_delete on public.veda_article_submissions for delete to authenticated using(private.is_super_admin());
create policy veda_issues_select on public.veda_issues for select to authenticated using(private.has_permission('veda.view'));
create policy veda_issues_insert on public.veda_issues for insert to authenticated with check(private.has_permission('veda.issues.manage'));
create policy veda_issues_update on public.veda_issues for update to authenticated using(private.has_permission('veda.issues.manage')) with check(private.has_permission('veda.issues.manage'));
create policy veda_issues_super_delete on public.veda_issues for delete to authenticated using(private.is_super_admin());

revoke all on public.veda_subscription_applications,public.veda_subscribers,public.veda_sensitive_data,public.veda_subscriber_change_requests,public.veda_article_submissions,public.veda_issues from anon;
revoke all on public.veda_subscription_applications,public.veda_subscribers,public.veda_sensitive_data,public.veda_subscriber_change_requests,public.veda_article_submissions,public.veda_issues from authenticated;
grant select,update,delete on public.veda_subscription_applications,public.veda_subscriber_change_requests,public.veda_article_submissions to authenticated;
grant select,insert,update,delete on public.veda_subscribers,public.veda_issues to authenticated;
grant select,update,delete on public.veda_sensitive_data to authenticated;

create unique index cash_transactions_one_active_reference_idx on public.cash_transactions(reference_type,reference_id) where reference_id is not null and voided_at is null and reference_type in ('donation','veda_subscription');

create or replace function public.submit_donation_intent(payload jsonb)
returns table(intent_id uuid,intent_number text)
language plpgsql security definer set search_path='' as $$
declare new_id uuid; new_number text; amount_value numeric;
begin
  if jsonb_typeof(payload) is distinct from 'object' then raise exception 'Invalid payload'; end if;
  if nullif(trim(payload->>'donor_name'),'') is null or nullif(trim(payload->>'mobile'),'') is null then raise exception 'Required fields missing'; end if;
  amount_value:=nullif(payload->>'pledged_amount','')::numeric;
  insert into public.donation_intents(donor_name,mobile,purpose_gu,pledged_amount,preferred_ashram_id)
  values(trim(payload->>'donor_name'),trim(payload->>'mobile'),nullif(trim(payload->>'purpose_gu'),''),amount_value,nullif(payload->>'preferred_ashram_id','')::uuid)
  returning id,donation_intents.intent_number into new_id,new_number;
  return query select new_id,new_number;
end; $$;

create or replace function public.submit_veda_subscription(payload jsonb)
returns table(application_id uuid,application_number text)
language plpgsql security definer set search_path='' as $$
declare new_id uuid; new_number text; pan_value text;
begin
  if jsonb_typeof(payload) is distinct from 'object' then raise exception 'Invalid payload'; end if;
  if nullif(trim(payload->>'full_name'),'') is null or nullif(trim(payload->>'mobile'),'') is null or nullif(trim(payload->>'full_address'),'') is null or nullif(trim(payload->>'pincode'),'') is null then raise exception 'Required fields missing'; end if;
  insert into public.veda_subscription_applications(full_name,mobile,village,full_address,pincode)
  values(trim(payload->>'full_name'),trim(payload->>'mobile'),nullif(trim(payload->>'village'),''),trim(payload->>'full_address'),trim(payload->>'pincode'))
  returning id,veda_subscription_applications.application_number into new_id,new_number;
  pan_value:=upper(nullif(trim(payload->>'pan_number'),''));
  if pan_value is not null then insert into public.veda_sensitive_data(application_id,pan_number) values(new_id,pan_value); end if;
  return query select new_id,new_number;
end; $$;

create or replace function public.submit_veda_change_request(payload jsonb)
returns table(request_id uuid,request_number text)
language plpgsql security definer set search_path='' as $$
declare new_id uuid; new_number text; kind text:=nullif(trim(payload->>'change_type'),'');
begin
  if kind not in ('name','address','name_and_address','other') or nullif(trim(payload->>'mobile'),'') is null then raise exception 'Invalid request'; end if;
  insert into public.veda_subscriber_change_requests(subscriber_number,mobile,change_type,requested_name,requested_address,requested_pincode,note)
  values(nullif(trim(payload->>'subscriber_number'),''),trim(payload->>'mobile'),kind,nullif(trim(payload->>'requested_name'),''),nullif(trim(payload->>'requested_address'),''),nullif(trim(payload->>'requested_pincode'),''),nullif(trim(payload->>'note'),''))
  returning id,veda_subscriber_change_requests.request_number into new_id,new_number;
  return query select new_id,new_number;
end; $$;

create or replace function public.submit_veda_article(payload jsonb)
returns table(submission_id uuid,submission_number text)
language plpgsql security definer set search_path='' as $$
declare new_id uuid; new_number text;
begin
  if nullif(trim(payload->>'author_name'),'') is null or nullif(trim(payload->>'mobile'),'') is null or nullif(trim(payload->>'title'),'') is null then raise exception 'Required fields missing'; end if;
  insert into public.veda_article_submissions(author_name,mobile,title,body_text,attachment_url,note)
  values(trim(payload->>'author_name'),trim(payload->>'mobile'),trim(payload->>'title'),nullif(trim(payload->>'body_text'),''),nullif(trim(payload->>'attachment_url'),''),nullif(trim(payload->>'note'),''))
  returning id,veda_article_submissions.submission_number into new_id,new_number;
  return query select new_id,new_number;
end; $$;

create or replace function public.record_cash_received(target_reference_type text,target_reference_id text,target_payer_name text,target_mobile text,target_amount numeric,target_purpose_gu text,target_ashram_id uuid default null,target_note text default null)
returns public.cash_transactions
language plpgsql security definer set search_path='' as $$
declare result public.cash_transactions;
begin
  if not private.has_permission('cash.record') then raise exception 'Permission denied'; end if;
  if target_reference_type not in ('donation','veda_subscription','membership','other') or target_amount<=0 or nullif(trim(target_payer_name),'') is null or nullif(trim(target_purpose_gu),'') is null then raise exception 'Invalid cash record'; end if;
  insert into public.cash_transactions(reference_type,reference_id,payer_name,mobile,amount,purpose_gu,ashram_id,received_by,note)
  values(target_reference_type,nullif(target_reference_id,''),trim(target_payer_name),nullif(trim(target_mobile),''),target_amount,trim(target_purpose_gu),target_ashram_id,auth.uid(),nullif(trim(target_note),'')) returning * into result;
  if target_reference_type='donation' then update public.donation_intents set status='cash_received',assigned_to=coalesce(assigned_to,auth.uid()) where id::text=target_reference_id;
  elsif target_reference_type='veda_subscription' then update public.veda_subscription_applications set status='cash_received',cash_transaction_id=result.id,reviewed_by=auth.uid(),reviewed_at=now() where id::text=target_reference_id;
  end if;
  return result;
end; $$;

create or replace function public.issue_cash_receipt(target_cash_transaction_id uuid)
returns public.receipts
language plpgsql security definer set search_path='' as $$
declare tx public.cash_transactions; result public.receipts; ashram_name text;
begin
  if not private.has_permission('receipts.issue') then raise exception 'Permission denied'; end if;
  select * into tx from public.cash_transactions where id=target_cash_transaction_id and voided_at is null;
  if tx.id is null then raise exception 'Cash transaction not found'; end if;
  select name_gu into ashram_name from public.ashram_profiles where id=tx.ashram_id;
  insert into public.receipts(cash_transaction_id,payer_name,amount,purpose_gu,ashram_name_snapshot,issued_by)
  values(tx.id,tx.payer_name,tx.amount,tx.purpose_gu,ashram_name,auth.uid()) returning * into result;
  if tx.reference_type='donation' then update public.donation_intents set status='receipt_issued' where id::text=tx.reference_id; end if;
  return result;
end; $$;

create or replace function public.activate_veda_subscription(target_application_id uuid)
returns public.veda_subscribers
language plpgsql security definer set search_path='' as $$
declare app public.veda_subscription_applications; new_sub public.veda_subscribers;
begin
  if not private.has_permission('veda.approve') then raise exception 'Permission denied'; end if;
  select * into app from public.veda_subscription_applications where id=target_application_id for update;
  if app.id is null then raise exception 'Application not found'; end if;
  if app.status='active' and app.subscriber_id is not null then select * into new_sub from public.veda_subscribers where id=app.subscriber_id; return new_sub; end if;
  if app.cash_transaction_id is null or not exists(select 1 from public.receipts r where r.cash_transaction_id=app.cash_transaction_id and r.status='issued') then raise exception 'Issued cash receipt required'; end if;
  insert into public.veda_subscribers(full_name,mobile,village,full_address,pincode,source_application_id,created_by)
  values(app.full_name,app.mobile,app.village,app.full_address,app.pincode,app.id,auth.uid()) returning * into new_sub;
  update public.veda_sensitive_data set subscriber_id=new_sub.id where application_id=app.id;
  update public.veda_subscription_applications set status='active',subscriber_id=new_sub.id,reviewed_by=auth.uid(),reviewed_at=now() where id=app.id;
  return new_sub;
end; $$;

create or replace function public.list_public_veda_issues()
returns table(id uuid,issue_date date,issue_year smallint,issue_month smallint,title_gu text,pdf_url text,cover_url text)
language sql security definer set search_path='' as $$
  select v.id,v.issue_date,v.issue_year,v.issue_month,v.title_gu,v.pdf_url,v.cover_url from public.veda_issues v where v.published=true and v.archived_at is null order by v.issue_date desc;
$$;

revoke all on function public.submit_donation_intent(jsonb),public.submit_veda_subscription(jsonb),public.submit_veda_change_request(jsonb),public.submit_veda_article(jsonb),public.record_cash_received(text,text,text,text,numeric,text,uuid,text),public.issue_cash_receipt(uuid),public.activate_veda_subscription(uuid),public.list_public_veda_issues() from public;
grant execute on function public.submit_donation_intent(jsonb),public.submit_veda_subscription(jsonb),public.submit_veda_change_request(jsonb),public.submit_veda_article(jsonb),public.list_public_veda_issues() to anon,authenticated;
grant execute on function public.record_cash_received(text,text,text,text,numeric,text,uuid,text),public.issue_cash_receipt(uuid),public.activate_veda_subscription(uuid) to authenticated;

create trigger audit_veda_apps after insert or update or delete on public.veda_subscription_applications for each row execute function public.audit_admin_row_change();
create trigger audit_veda_subscribers after insert or update or delete on public.veda_subscribers for each row execute function public.audit_admin_row_change();
create trigger audit_veda_changes after insert or update or delete on public.veda_subscriber_change_requests for each row execute function public.audit_admin_row_change();
create trigger audit_veda_articles after insert or update or delete on public.veda_article_submissions for each row execute function public.audit_admin_row_change();
create trigger audit_veda_issues after insert or update or delete on public.veda_issues for each row execute function public.audit_admin_row_change();
