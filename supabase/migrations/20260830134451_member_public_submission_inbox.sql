create or replace function private.membership_application_inbox_insert()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  insert into public.inbox_items(source_type,source_id,category,title,subtitle,contact_name,contact_mobile,status,priority,payload)
  values('membership_application',new.id::text,'membership','સભ્યપદ અરજી '||new.application_number,new.native_village,concat_ws(' ',new.first_name,new.father_name,new.surname),new.mobile,'new','normal',jsonb_build_object('application_number',new.application_number,'family_member_count',new.family_member_count));
  return new;
end;
$$;
revoke execute on function private.membership_application_inbox_insert() from public,anon,authenticated;

create trigger membership_application_create_inbox after insert on public.membership_applications for each row execute function private.membership_application_inbox_insert();

create or replace function public.submit_membership_application(payload jsonb)
returns table(application_id uuid, application_number text)
language plpgsql security definer set search_path=''
as $$
declare
  app_id uuid; app_number text; member jsonb;
  member_count int := coalesce(jsonb_array_length(coalesce(payload->'family_members','[]'::jsonb)),0);
  i int := 0;
  first_name text := nullif(trim(payload->>'first_name'),'');
  full_address text := nullif(trim(payload->>'full_address'),'');
  mobile text := nullif(trim(payload->>'mobile'),'');
  native_village text := nullif(trim(payload->>'native_village'),'');
  gender text := nullif(trim(payload->>'gender'),'');
  age_value int;
begin
  if jsonb_typeof(payload) is distinct from 'object' then raise exception 'Invalid submission'; end if;
  if first_name is null or full_address is null or mobile is null or native_village is null or gender is null then raise exception 'Required fields are missing'; end if;
  age_value := nullif(payload->>'age','')::int;
  if age_value is null or age_value<0 or age_value>120 then raise exception 'Invalid age'; end if;
  if gender not in ('male','female','other','prefer_not_to_say') then raise exception 'Invalid gender'; end if;
  if member_count>20 then raise exception 'Too many family members'; end if;

  insert into public.membership_applications(first_name,father_name,surname,full_address,education,mobile,occupation,native_village,blood_group,gender,age,family_member_count)
  values(first_name,nullif(trim(payload->>'father_name'),''),nullif(trim(payload->>'surname'),''),full_address,nullif(trim(payload->>'education'),''),mobile,nullif(trim(payload->>'occupation'),''),native_village,nullif(trim(payload->>'blood_group'),''),gender,age_value,member_count)
  returning id,membership_applications.application_number into app_id,app_number;

  for member in select value from jsonb_array_elements(coalesce(payload->'family_members','[]'::jsonb)) loop
    i:=i+1;
    if nullif(trim(member->>'first_name'),'') is null then raise exception 'Family member name is required'; end if;
    insert into public.membership_application_members(application_id,member_order,relationship,first_name,father_name,surname,age,gender,education,occupation,mobile,blood_group,native_village)
    values(app_id,i,nullif(trim(member->>'relationship'),''),nullif(trim(member->>'first_name'),''),nullif(trim(member->>'father_name'),''),nullif(trim(member->>'surname'),''),case when nullif(member->>'age','') is null then null else (member->>'age')::int end,nullif(trim(member->>'gender'),''),nullif(trim(member->>'education'),''),nullif(trim(member->>'occupation'),''),nullif(trim(member->>'mobile'),''),nullif(trim(member->>'blood_group'),''),nullif(trim(member->>'native_village'),''));
  end loop;
  return query select app_id,app_number;
end;
$$;
revoke all on function public.submit_membership_application(jsonb) from public;
grant execute on function public.submit_membership_application(jsonb) to anon,authenticated;
