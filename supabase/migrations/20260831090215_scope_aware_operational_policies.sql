create or replace function private.can_access_room(requested_permission text,target_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select coalesce((select private.has_ashram_permission(requested_permission,r.ashram_id) from public.rooms r where r.id=target_room_id),false);
$$;
revoke all on function private.can_access_room(text,uuid) from public,anon;
grant execute on function private.can_access_room(text,uuid) to authenticated;

drop policy if exists inbox_select on public.inbox_items;
create policy inbox_select on public.inbox_items for select to authenticated using(private.has_global_permission('inbox.view') or (ashram_key is not null and private.has_ashram_slug_permission('inbox.view',ashram_key)));
drop policy if exists inbox_insert on public.inbox_items;
create policy inbox_insert on public.inbox_items for insert to authenticated with check(private.has_global_permission('inbox.update') or (ashram_key is not null and private.has_ashram_slug_permission('inbox.update',ashram_key)));
drop policy if exists inbox_update on public.inbox_items;
create policy inbox_update on public.inbox_items for update to authenticated using(private.has_global_permission('inbox.update') or (ashram_key is not null and private.has_ashram_slug_permission('inbox.update',ashram_key))) with check(private.has_global_permission('inbox.update') or (ashram_key is not null and private.has_ashram_slug_permission('inbox.update',ashram_key)));

drop policy if exists ashram_profiles_admin_insert on public.ashram_profiles;
create policy ashram_profiles_admin_insert on public.ashram_profiles for insert to authenticated with check(private.has_global_permission('ashrams.manage'));
drop policy if exists ashram_profiles_admin_update on public.ashram_profiles;
create policy ashram_profiles_admin_update on public.ashram_profiles for update to authenticated using(private.has_ashram_permission('ashrams.manage',id)) with check(private.has_ashram_permission('ashrams.manage',id));

drop policy if exists stay_requests_admin_select on public.stay_requests;
create policy stay_requests_admin_select on public.stay_requests for select to authenticated using(private.has_ashram_permission('stays.view',ashram_id));
drop policy if exists stay_requests_admin_update on public.stay_requests;
create policy stay_requests_admin_update on public.stay_requests for update to authenticated using(private.has_ashram_permission('stays.review',ashram_id)) with check(private.has_ashram_permission('stays.review',ashram_id));
drop policy if exists stay_guests_admin_select on public.stay_guests;
create policy stay_guests_admin_select on public.stay_guests for select to authenticated using(private.can_access_stay('stays.view',stay_request_id));
drop policy if exists stay_meals_admin_select on public.stay_meal_requirements;
create policy stay_meals_admin_select on public.stay_meal_requirements for select to authenticated using(private.can_access_stay('stays.view',stay_request_id));
drop policy if exists stay_meals_admin_insert on public.stay_meal_requirements;
create policy stay_meals_admin_insert on public.stay_meal_requirements for insert to authenticated with check(private.can_access_stay('stays.review',stay_request_id));
drop policy if exists stay_meals_admin_update on public.stay_meal_requirements;
create policy stay_meals_admin_update on public.stay_meal_requirements for update to authenticated using(private.can_access_stay('stays.review',stay_request_id)) with check(private.can_access_stay('stays.review',stay_request_id));

drop policy if exists room_assignments_admin_select on public.room_assignments;
create policy room_assignments_admin_select on public.room_assignments for select to authenticated using(private.can_access_stay('stays.view',stay_request_id));
drop policy if exists room_assignments_admin_insert on public.room_assignments;
create policy room_assignments_admin_insert on public.room_assignments for insert to authenticated with check(private.can_access_stay('stays.assign_room',stay_request_id));
drop policy if exists room_assignments_admin_update on public.room_assignments;
create policy room_assignments_admin_update on public.room_assignments for update to authenticated using(private.can_access_stay('stays.assign_room',stay_request_id)) with check(private.can_access_stay('stays.assign_room',stay_request_id));

drop policy if exists rooms_admin_select on public.rooms;
create policy rooms_admin_select on public.rooms for select to authenticated using(private.has_ashram_permission('stays.view',ashram_id) or private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists rooms_admin_insert on public.rooms;
create policy rooms_admin_insert on public.rooms for insert to authenticated with check(private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists rooms_admin_update on public.rooms;
create policy rooms_admin_update on public.rooms for update to authenticated using(private.has_ashram_permission('ashrams.manage',ashram_id)) with check(private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists room_types_admin_select on public.room_types;
create policy room_types_admin_select on public.room_types for select to authenticated using(private.has_ashram_permission('stays.view',ashram_id) or private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists room_types_admin_insert on public.room_types;
create policy room_types_admin_insert on public.room_types for insert to authenticated with check(private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists room_types_admin_update on public.room_types;
create policy room_types_admin_update on public.room_types for update to authenticated using(private.has_ashram_permission('ashrams.manage',ashram_id)) with check(private.has_ashram_permission('ashrams.manage',ashram_id));
drop policy if exists room_blocks_admin_select on public.room_blocks;
create policy room_blocks_admin_select on public.room_blocks for select to authenticated using(private.can_access_room('stays.view',room_id) or private.can_access_room('ashrams.manage',room_id));
drop policy if exists room_blocks_admin_insert on public.room_blocks;
create policy room_blocks_admin_insert on public.room_blocks for insert to authenticated with check(private.can_access_room('ashrams.manage',room_id));
drop policy if exists room_blocks_admin_update on public.room_blocks;
create policy room_blocks_admin_update on public.room_blocks for update to authenticated using(private.can_access_room('ashrams.manage',room_id)) with check(private.can_access_room('ashrams.manage',room_id));

drop policy if exists booking_documents_sensitive_select on public.booking_documents;
create policy booking_documents_sensitive_select on public.booking_documents for select to authenticated using(private.can_access_stay('sensitive_docs.view',stay_request_id));
drop policy if exists booking_documents_sensitive_insert on public.booking_documents;
create policy booking_documents_sensitive_insert on public.booking_documents for insert to authenticated with check(private.can_access_stay('sensitive_docs.manage',stay_request_id));
drop policy if exists booking_documents_sensitive_update on public.booking_documents;
create policy booking_documents_sensitive_update on public.booking_documents for update to authenticated using(private.can_access_stay('sensitive_docs.manage',stay_request_id)) with check(private.can_access_stay('sensitive_docs.manage',stay_request_id));
drop policy if exists booking_doc_tokens_select on public.booking_document_upload_tokens;
create policy booking_doc_tokens_select on public.booking_document_upload_tokens for select to authenticated using(private.can_access_stay('sensitive_docs.manage',stay_request_id));
drop policy if exists booking_doc_tokens_insert on public.booking_document_upload_tokens;
create policy booking_doc_tokens_insert on public.booking_document_upload_tokens for insert to authenticated with check(private.can_access_stay('sensitive_docs.manage',stay_request_id));
drop policy if exists booking_doc_tokens_update on public.booking_document_upload_tokens;
create policy booking_doc_tokens_update on public.booking_document_upload_tokens for update to authenticated using(private.can_access_stay('sensitive_docs.manage',stay_request_id)) with check(private.can_access_stay('sensitive_docs.manage',stay_request_id));

drop policy if exists programme_centres_admin_select on public.programme_centres;
create policy programme_centres_admin_select on public.programme_centres for select to authenticated using(case when ashram_id is null then private.has_global_permission('programmes.view') else private.has_ashram_permission('programmes.view',ashram_id) end);
drop policy if exists programme_centres_admin_insert on public.programme_centres;
create policy programme_centres_admin_insert on public.programme_centres for insert to authenticated with check(case when ashram_id is null then private.has_global_permission('programmes.manage') else private.has_ashram_permission('programmes.manage',ashram_id) end);
drop policy if exists programme_centres_admin_update on public.programme_centres;
create policy programme_centres_admin_update on public.programme_centres for update to authenticated using(case when ashram_id is null then private.has_global_permission('programmes.manage') else private.has_ashram_permission('programmes.manage',ashram_id) end) with check(case when ashram_id is null then private.has_global_permission('programmes.manage') else private.has_ashram_permission('programmes.manage',ashram_id) end);

drop policy if exists tithi_programmes_admin_select on public.tithi_programmes;
create policy tithi_programmes_admin_select on public.tithi_programmes for select to authenticated using(case when ashram_id is null then private.has_global_permission('programmes.view') or private.has_global_permission('events.manage') else private.has_ashram_permission('programmes.view',ashram_id) or private.has_ashram_permission('events.manage',ashram_id) end);
drop policy if exists tithi_programmes_admin_insert on public.tithi_programmes;
create policy tithi_programmes_admin_insert on public.tithi_programmes for insert to authenticated with check(case when ashram_id is null then private.has_global_permission('events.manage') else private.has_ashram_permission('events.manage',ashram_id) end);
drop policy if exists tithi_programmes_admin_update on public.tithi_programmes;
create policy tithi_programmes_admin_update on public.tithi_programmes for update to authenticated using(case when ashram_id is null then private.has_global_permission('events.manage') else private.has_ashram_permission('events.manage',ashram_id) end) with check(case when ashram_id is null then private.has_global_permission('events.manage') else private.has_ashram_permission('events.manage',ashram_id) end);

drop policy if exists seva_activities_admin_select on public.seva_activities;
create policy seva_activities_admin_select on public.seva_activities for select to authenticated using(case when ashram_id is null then private.has_global_permission('content.view') or private.has_global_permission('seva.manage') else private.has_ashram_permission('content.view',ashram_id) or private.has_ashram_permission('seva.manage',ashram_id) end);
drop policy if exists seva_activities_admin_insert on public.seva_activities;
create policy seva_activities_admin_insert on public.seva_activities for insert to authenticated with check(case when ashram_id is null then private.has_global_permission('seva.manage') else private.has_ashram_permission('seva.manage',ashram_id) end);
drop policy if exists seva_activities_admin_update on public.seva_activities;
create policy seva_activities_admin_update on public.seva_activities for update to authenticated using(case when ashram_id is null then private.has_global_permission('seva.manage') else private.has_ashram_permission('seva.manage',ashram_id) end) with check(case when ashram_id is null then private.has_global_permission('seva.manage') else private.has_ashram_permission('seva.manage',ashram_id) end);

drop policy if exists volunteer_admin_select on public.volunteer_applications;
create policy volunteer_admin_select on public.volunteer_applications for select to authenticated using(case when preferred_ashram_id is null then private.has_global_permission('volunteer.view') else private.has_ashram_permission('volunteer.view',preferred_ashram_id) end);
drop policy if exists volunteer_admin_update on public.volunteer_applications;
create policy volunteer_admin_update on public.volunteer_applications for update to authenticated using(case when preferred_ashram_id is null then private.has_global_permission('volunteer.review') else private.has_ashram_permission('volunteer.review',preferred_ashram_id) end) with check(case when preferred_ashram_id is null then private.has_global_permission('volunteer.review') else private.has_ashram_permission('volunteer.review',preferred_ashram_id) end);

drop policy if exists donation_admin_select on public.donation_intents;
create policy donation_admin_select on public.donation_intents for select to authenticated using(case when preferred_ashram_id is null then private.has_global_permission('cash.record') or private.has_global_permission('inbox.view') else private.has_ashram_permission('cash.record',preferred_ashram_id) or private.has_ashram_permission('inbox.view',preferred_ashram_id) end);
drop policy if exists donation_admin_update on public.donation_intents;
create policy donation_admin_update on public.donation_intents for update to authenticated using(case when preferred_ashram_id is null then private.has_global_permission('cash.record') else private.has_ashram_permission('cash.record',preferred_ashram_id) end) with check(case when preferred_ashram_id is null then private.has_global_permission('cash.record') else private.has_ashram_permission('cash.record',preferred_ashram_id) end);

drop policy if exists cash_admin_select on public.cash_transactions;
create policy cash_admin_select on public.cash_transactions for select to authenticated using(case when ashram_id is null then private.has_global_permission('cash.record') or private.has_global_permission('receipts.issue') else private.has_ashram_permission('cash.record',ashram_id) or private.has_ashram_permission('receipts.issue',ashram_id) end);
drop policy if exists cash_admin_insert on public.cash_transactions;
create policy cash_admin_insert on public.cash_transactions for insert to authenticated with check(received_by=auth.uid() and (case when ashram_id is null then private.has_global_permission('cash.record') else private.has_ashram_permission('cash.record',ashram_id) end));
drop policy if exists receipts_admin_select on public.receipts;
create policy receipts_admin_select on public.receipts for select to authenticated using(private.can_access_cash('receipts.issue',cash_transaction_id) or private.can_access_cash('cash.record',cash_transaction_id));
drop policy if exists receipts_admin_insert on public.receipts;
create policy receipts_admin_insert on public.receipts for insert to authenticated with check(issued_by=auth.uid() and private.can_access_cash('receipts.issue',cash_transaction_id));

create or replace function private.operations_inbox_insert()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if tg_table_name='volunteer_applications' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,ashram_key,status,priority,payload)
    select 'volunteer_application',new.id::text,'volunteer','સ્વયંસેવક અરજી '||new.application_number,coalesce(new.time_slot,''),new.full_name,new.mobile,a.slug,'new','normal',jsonb_build_object('application_number',new.application_number)
    from (select new.preferred_ashram_id as id) x left join public.ashram_profiles a on a.id=x.id;
  elsif tg_table_name='stay_requests' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,ashram_key,status,priority,payload)
    select 'stay_request',new.id::text,'room_booking','રૂમ અરજી '||new.request_number,a.name_gu,new.applicant_name,new.mobile,a.slug,'new','normal',jsonb_build_object('request_number',new.request_number,'check_in',new.check_in,'check_out',new.check_out,'total_members',new.total_members)
    from public.ashram_profiles a where a.id=new.ashram_id;
  end if;
  return new;
end;
$$;
