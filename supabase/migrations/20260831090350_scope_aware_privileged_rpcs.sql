create or replace function public.review_membership_application(target_application_id uuid,next_status text,note text default null)
returns public.membership_applications
language plpgsql
security definer
set search_path=''
as $$
declare result public.membership_applications;
begin
  if not private.has_global_permission('membership.review') then raise exception 'Permission denied'; end if;
  if next_status not in ('reviewing','needs_changes','rejected') then raise exception 'Invalid review status'; end if;
  update public.membership_applications set status=next_status::public.membership_application_status,review_note=nullif(trim(note),''),reviewed_by=auth.uid(),reviewed_at=now() where id=target_application_id and status<>'approved' returning * into result;
  if result.id is null then raise exception 'Application not found or already approved'; end if;
  return result;
end;
$$;

create or replace function public.approve_membership_application(target_application_id uuid)
returns table(household_id uuid,membership_id uuid,membership_number text)
language plpgsql
security definer
set search_path=''
as $$
declare app public.membership_applications; family_member public.membership_application_members; new_household uuid; primary_person uuid; new_membership uuid; new_membership_number text;
begin
  if not private.has_global_permission('membership.approve') then raise exception 'Permission denied'; end if;
  select * into app from public.membership_applications where id=target_application_id for update;
  if app.id is null then raise exception 'Application not found'; end if;
  if app.status='approved' then raise exception 'Application already approved'; end if;
  insert into public.households(full_address,native_village,primary_mobile,source_application_id,created_by) values(app.full_address,app.native_village,app.mobile,app.id,auth.uid()) returning id into new_household;
  insert into public.people(household_id,is_primary,first_name,father_name,surname,age,gender,education,occupation,mobile,blood_group,native_village) values(new_household,true,app.first_name,app.father_name,app.surname,app.age,app.gender,app.education,app.occupation,app.mobile,app.blood_group,app.native_village) returning id into primary_person;
  update public.households set primary_person_id=primary_person where id=new_household;
  for family_member in select * from public.membership_application_members where application_id=app.id order by member_order loop
    insert into public.people(household_id,is_primary,relationship_to_primary,first_name,father_name,surname,age,gender,education,occupation,mobile,blood_group,native_village) values(new_household,false,family_member.relationship,family_member.first_name,family_member.father_name,family_member.surname,family_member.age,family_member.gender,family_member.education,family_member.occupation,family_member.mobile,family_member.blood_group,coalesce(family_member.native_village,app.native_village));
  end loop;
  insert into public.memberships(household_id,primary_person_id,source_application_id,created_by) values(new_household,primary_person,app.id,auth.uid()) returning id,memberships.membership_number into new_membership,new_membership_number;
  update public.membership_applications set status='approved',approved_household_id=new_household,reviewed_by=auth.uid(),reviewed_at=now(),review_note=null where id=app.id;
  return query select new_household,new_membership,new_membership_number;
end;
$$;

create or replace function public.activate_veda_subscription(target_application_id uuid)
returns public.veda_subscribers
language plpgsql
security definer
set search_path=''
as $$
declare app public.veda_subscription_applications; new_sub public.veda_subscribers;
begin
  if not private.has_global_permission('veda.approve') then raise exception 'Permission denied'; end if;
  select * into app from public.veda_subscription_applications where id=target_application_id for update;
  if app.id is null then raise exception 'Application not found'; end if;
  if app.status='active' and app.subscriber_id is not null then select * into new_sub from public.veda_subscribers where id=app.subscriber_id; return new_sub; end if;
  if app.cash_transaction_id is null or not exists(select 1 from public.receipts r where r.cash_transaction_id=app.cash_transaction_id and r.status='issued') then raise exception 'Issued cash receipt required'; end if;
  insert into public.veda_subscribers(full_name,mobile,village,full_address,pincode,source_application_id,created_by) values(app.full_name,app.mobile,app.village,app.full_address,app.pincode,app.id,auth.uid()) returning * into new_sub;
  update public.veda_sensitive_data set subscriber_id=new_sub.id where application_id=app.id;
  update public.veda_subscription_applications set status='active',subscriber_id=new_sub.id,reviewed_by=auth.uid(),reviewed_at=now() where id=app.id;
  return new_sub;
end;
$$;

create or replace function public.assign_stay_room(target_stay_request_id uuid,target_room_id uuid)
returns public.room_assignments
language plpgsql
security definer
set search_path=''
as $$
declare req public.stay_requests; room_row public.rooms; result public.room_assignments;
begin
  select * into req from public.stay_requests where id=target_stay_request_id for update;
  if req.id is null then raise exception 'Stay request not found'; end if;
  if not private.has_ashram_permission('stays.assign_room',req.ashram_id) then raise exception 'Permission denied'; end if;
  if req.status not in ('approved','room_assigned') then raise exception 'Stay request must be approved'; end if;
  select * into room_row from public.rooms where id=target_room_id and active=true and archived_at is null;
  if room_row.id is null or room_row.ashram_id<>req.ashram_id then raise exception 'Room not available for this ashram'; end if;
  if room_row.capacity<req.total_members then raise exception 'Room capacity too small'; end if;
  if exists(select 1 from public.room_blocks b where b.room_id=room_row.id and daterange(b.blocked_from,b.blocked_until,'[]') && daterange(req.check_in,req.check_out,'[)')) then raise exception 'Room is blocked'; end if;
  if exists(select 1 from public.room_assignments ra join public.stay_requests sr on sr.id=ra.stay_request_id where ra.room_id=room_row.id and ra.released_at is null and sr.id<>req.id and sr.status in ('approved','room_assigned','checked_in') and daterange(sr.check_in,sr.check_out,'[)') && daterange(req.check_in,req.check_out,'[)')) then raise exception 'Room already assigned for these dates'; end if;
  insert into public.room_assignments(stay_request_id,room_id,assigned_by) values(req.id,room_row.id,auth.uid()) on conflict(stay_request_id,room_id) do update set released_at=null,assigned_by=auth.uid(),assigned_at=now() returning * into result;
  update public.stay_requests set status='room_assigned',assigned_to=coalesce(assigned_to,auth.uid()) where id=req.id;
  return result;
end;
$$;

create or replace function public.release_stay_room(target_assignment_id uuid)
returns void
language plpgsql
security definer
set search_path=''
as $$
declare target_ashram_id uuid;
begin
  select sr.ashram_id into target_ashram_id from public.room_assignments ra join public.stay_requests sr on sr.id=ra.stay_request_id where ra.id=target_assignment_id;
  if target_ashram_id is null then raise exception 'Room assignment not found'; end if;
  if not private.has_ashram_permission('stays.assign_room',target_ashram_id) then raise exception 'Permission denied'; end if;
  update public.room_assignments set released_at=now() where id=target_assignment_id;
end;
$$;

create or replace function public.create_booking_document_upload_token(target_stay_request_id uuid,valid_hours integer default 48)
returns text
language plpgsql
security definer
set search_path=''
as $$
declare raw_token text; req public.stay_requests;
begin
  if valid_hours<1 or valid_hours>168 then raise exception 'Token validity must be between 1 and 168 hours'; end if;
  select * into req from public.stay_requests where id=target_stay_request_id;
  if req.id is null then raise exception 'Stay request not found'; end if;
  if not private.has_ashram_permission('sensitive_docs.manage',req.ashram_id) then raise exception 'Permission denied'; end if;
  if req.status in ('checked_out','rejected','cancelled') then raise exception 'Documents are not accepted for this request status'; end if;
  raw_token:=encode(extensions.gen_random_bytes(32),'hex');
  insert into public.booking_document_upload_tokens(stay_request_id,token_hash,expires_at,created_by) values(req.id,encode(extensions.digest(raw_token,'sha256'),'hex'),now()+make_interval(hours=>valid_hours),auth.uid());
  return raw_token;
end;
$$;

create or replace function public.record_cash_received(target_reference_type text,target_reference_id text,target_payer_name text,target_mobile text,target_amount numeric,target_purpose_gu text,target_ashram_id uuid default null,target_note text default null)
returns public.cash_transactions
language plpgsql
security definer
set search_path=''
as $$
declare result public.cash_transactions; donation_ashram_id uuid;
begin
  if target_reference_type not in ('donation','veda_subscription','membership','other') or target_amount<=0 or nullif(trim(target_payer_name),'') is null or nullif(trim(target_purpose_gu),'') is null then raise exception 'Invalid cash record'; end if;
  if target_reference_type='donation' and nullif(target_reference_id,'') is not null then
    select preferred_ashram_id into donation_ashram_id from public.donation_intents where id::text=target_reference_id;
    if not found then raise exception 'Donation intent not found'; end if;
    if donation_ashram_id is distinct from target_ashram_id then raise exception 'Donation Ashram mismatch'; end if;
  end if;
  if target_reference_type in ('veda_subscription','membership') then
    if target_ashram_id is not null or not private.has_global_permission('cash.record') then raise exception 'Global cash permission required'; end if;
  elsif target_ashram_id is null then
    if not private.has_global_permission('cash.record') then raise exception 'Permission denied'; end if;
  elsif not private.has_ashram_permission('cash.record',target_ashram_id) then raise exception 'Permission denied'; end if;
  insert into public.cash_transactions(reference_type,reference_id,payer_name,mobile,amount,purpose_gu,ashram_id,received_by,note) values(target_reference_type,nullif(target_reference_id,''),trim(target_payer_name),nullif(trim(target_mobile),''),target_amount,trim(target_purpose_gu),target_ashram_id,auth.uid(),nullif(trim(target_note),'')) returning * into result;
  if target_reference_type='donation' then update public.donation_intents set status='cash_received',assigned_to=coalesce(assigned_to,auth.uid()) where id::text=target_reference_id;
  elsif target_reference_type='veda_subscription' then update public.veda_subscription_applications set status='cash_received',cash_transaction_id=result.id,reviewed_by=auth.uid(),reviewed_at=now() where id::text=target_reference_id;
  end if;
  return result;
end;
$$;

create or replace function public.issue_cash_receipt(target_cash_transaction_id uuid)
returns public.receipts
language plpgsql
security definer
set search_path=''
as $$
declare tx public.cash_transactions; result public.receipts; ashram_name text;
begin
  select * into tx from public.cash_transactions where id=target_cash_transaction_id and voided_at is null;
  if tx.id is null then raise exception 'Cash transaction not found'; end if;
  if tx.ashram_id is null then
    if not private.has_global_permission('receipts.issue') then raise exception 'Permission denied'; end if;
  elsif not private.has_ashram_permission('receipts.issue',tx.ashram_id) then raise exception 'Permission denied'; end if;
  select name_gu into ashram_name from public.ashram_profiles where id=tx.ashram_id;
  insert into public.receipts(cash_transaction_id,payer_name,amount,purpose_gu,ashram_name_snapshot,issued_by) values(tx.id,tx.payer_name,tx.amount,tx.purpose_gu,ashram_name,auth.uid()) returning * into result;
  if tx.reference_type='donation' then update public.donation_intents set status='receipt_issued' where id::text=tx.reference_id; end if;
  return result;
end;
$$;
