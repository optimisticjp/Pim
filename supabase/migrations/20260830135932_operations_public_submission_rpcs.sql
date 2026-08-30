create or replace function public.submit_volunteer_application(payload jsonb)
returns table(application_id uuid, application_number text)
language plpgsql security definer set search_path = '' as $$
declare new_id uuid; new_number text; name_value text:=nullif(trim(payload->>'full_name'),''); mobile_value text:=nullif(trim(payload->>'mobile'),''); address_value text:=nullif(trim(payload->>'full_address'),'');
begin
  if jsonb_typeof(payload) is distinct from 'object' or name_value is null or mobile_value is null or address_value is null then raise exception 'Required fields missing'; end if;
  insert into public.volunteer_applications(full_name,mobile,full_address,age,available_from,available_until,time_slot,preferred_ashram_id,preferred_seva,skills,notes)
  values(name_value,mobile_value,address_value,nullif(payload->>'age','')::smallint,nullif(payload->>'available_from','')::date,nullif(payload->>'available_until','')::date,nullif(trim(payload->>'time_slot'),''),nullif(payload->>'preferred_ashram_id','')::uuid,case when jsonb_typeof(payload->'preferred_seva')='array' then array(select jsonb_array_elements_text(payload->'preferred_seva')) else null end,nullif(trim(payload->>'skills'),''),nullif(trim(payload->>'notes'),''))
  returning id,volunteer_applications.application_number into new_id,new_number;
  return query select new_id,new_number;
end; $$;

create or replace function public.submit_stay_request(payload jsonb)
returns table(request_id uuid, request_number text)
language plpgsql security definer set search_path = '' as $$
declare new_id uuid; new_number text; guest jsonb; i int:=0; guests jsonb:=coalesce(payload->'guests','[]'::jsonb); c_in date; c_out date; total int;
begin
  if jsonb_typeof(payload) is distinct from 'object' then raise exception 'Invalid payload'; end if;
  c_in:=nullif(payload->>'check_in','')::date; c_out:=nullif(payload->>'check_out','')::date; total:=nullif(payload->>'total_members','')::int;
  if nullif(trim(payload->>'applicant_name'),'') is null or nullif(trim(payload->>'mobile'),'') is null or nullif(trim(payload->>'native_village'),'') is null or nullif(trim(payload->>'full_address'),'') is null or nullif(payload->>'ashram_id','') is null then raise exception 'Required fields missing'; end if;
  if c_in is null or c_out is null or c_out<=c_in or c_in<current_date then raise exception 'Invalid stay dates'; end if;
  if total is null or total<1 or total>30 then raise exception 'Invalid member count'; end if;
  if jsonb_typeof(guests)<>'array' or jsonb_array_length(guests)>30 then raise exception 'Invalid guest list'; end if;
  insert into public.stay_requests(applicant_name,mobile,native_village,full_address,reference_name,ashram_id,check_in,check_out,total_members,takes_prasad,breakfast_count,lunch_count,dinner_count)
  values(trim(payload->>'applicant_name'),trim(payload->>'mobile'),trim(payload->>'native_village'),trim(payload->>'full_address'),nullif(trim(payload->>'reference_name'),''),(payload->>'ashram_id')::uuid,c_in,c_out,total,coalesce((payload->>'takes_prasad')::boolean,false),coalesce(nullif(payload->>'breakfast_count','')::smallint,0),coalesce(nullif(payload->>'lunch_count','')::smallint,0),coalesce(nullif(payload->>'dinner_count','')::smallint,0))
  returning id,stay_requests.request_number into new_id,new_number;
  for guest in select value from jsonb_array_elements(guests) loop
    i:=i+1;
    if nullif(trim(guest->>'full_name'),'') is null then raise exception 'Guest name required'; end if;
    insert into public.stay_guests(stay_request_id,guest_order,full_name,age,relationship) values(new_id,i,trim(guest->>'full_name'),nullif(guest->>'age','')::smallint,nullif(trim(guest->>'relationship'),''));
  end loop;
  if coalesce((payload->>'takes_prasad')::boolean,false) then
    insert into public.stay_meal_requirements(stay_request_id,meal_date,breakfast_count,lunch_count,dinner_count)
    select new_id,d::date,coalesce(nullif(payload->>'breakfast_count','')::smallint,0),coalesce(nullif(payload->>'lunch_count','')::smallint,0),coalesce(nullif(payload->>'dinner_count','')::smallint,0) from generate_series(c_in,c_out-1,interval '1 day') d;
  end if;
  return query select new_id,new_number;
end; $$;

create or replace function private.operations_inbox_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name='volunteer_applications' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,status,priority,payload)
    values('volunteer_application',new.id::text,'volunteer','સ્વયંસેવક અરજી '||new.application_number,coalesce(new.time_slot,''),new.full_name,new.mobile,'new','normal',jsonb_build_object('application_number',new.application_number));
  elsif tg_table_name='stay_requests' then
    insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,ashram_key,status,priority,payload)
    select 'stay_request',new.id::text,'room_booking','રૂમ અરજી '||new.request_number,a.name_gu,new.applicant_name,new.mobile,a.slug,'new','normal',jsonb_build_object('request_number',new.request_number,'check_in',new.check_in,'check_out',new.check_out,'total_members',new.total_members) from public.ashram_profiles a where a.id=new.ashram_id;
  end if;
  return new;
end; $$;

create or replace function private.operations_inbox_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    if tg_table_name='volunteer_applications' then update public.inbox_items set status=new.status,assigned_to=coalesce(assigned_to,new.reviewed_by) where source_type='volunteer_application' and source_id=new.id::text;
    elsif tg_table_name='stay_requests' then update public.inbox_items set status=new.status,assigned_to=coalesce(assigned_to,new.assigned_to) where source_type='stay_request' and source_id=new.id::text; end if;
    insert into public.status_history(entity_type,entity_id,from_status,to_status,changed_by,note) values(tg_table_name,new.id::text,old.status,new.status,auth.uid(),case when tg_table_name='stay_requests' then new.admin_note else new.review_note end);
  end if;
  return new;
end; $$;

create trigger volunteer_create_inbox after insert on public.volunteer_applications for each row execute function private.operations_inbox_insert();
create trigger volunteer_sync_inbox after update of status on public.volunteer_applications for each row execute function private.operations_inbox_status();
create trigger stay_create_inbox after insert on public.stay_requests for each row execute function private.operations_inbox_insert();
create trigger stay_sync_inbox after update of status on public.stay_requests for each row execute function private.operations_inbox_status();
