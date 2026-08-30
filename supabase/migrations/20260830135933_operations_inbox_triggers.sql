create or replace function private.operations_inbox_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name='volunteer_applications' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,status,priority,payload)
    values('volunteer_application',new.id::text,'volunteer','સ્વયંસેવક અરજી '||new.application_number,coalesce(new.time_slot,''),new.full_name,new.mobile,'new','normal',jsonb_build_object('application_number',new.application_number));
  elsif tg_table_name='stay_requests' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,ashram_key,status,priority,payload)
    select 'stay_request',new.id::text,'room_booking','રૂમ અરજી '||new.request_number,a.name_gu,new.applicant_name,new.mobile,a.slug,'new','normal',jsonb_build_object('request_number',new.request_number,'check_in',new.check_in,'check_out',new.check_out,'total_members',new.total_members)
    from public.ashram_profiles a where a.id=new.ashram_id;
  end if;
  return new;
end; $$;

create or replace function private.operations_inbox_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    if tg_table_name='volunteer_applications' then
      update public.inbox_items set status=new.status,assigned_to=coalesce(assigned_to,new.reviewed_by) where source_type='volunteer_application' and source_id=new.id::text;
    elsif tg_table_name='stay_requests' then
      update public.inbox_items set status=new.status,assigned_to=coalesce(assigned_to,new.assigned_to) where source_type='stay_request' and source_id=new.id::text;
    end if;
    insert into public.status_history(entity_type,entity_id,from_status,to_status,changed_by,note)
    values(tg_table_name,new.id::text,old.status,new.status,auth.uid(),case when tg_table_name='stay_requests' then new.admin_note else new.review_note end);
  end if;
  return new;
end; $$;

create trigger volunteer_create_inbox after insert on public.volunteer_applications for each row execute function private.operations_inbox_insert();
create trigger volunteer_sync_inbox after update of status on public.volunteer_applications for each row execute function private.operations_inbox_status();
create trigger stay_create_inbox after insert on public.stay_requests for each row execute function private.operations_inbox_insert();
create trigger stay_sync_inbox after update of status on public.stay_requests for each row execute function private.operations_inbox_status();
