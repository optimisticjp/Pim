create or replace function private.membership_application_inbox_status()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if new.status is distinct from old.status then
    update public.inbox_items
    set status=case new.status when 'submitted' then 'new' when 'reviewing' then 'reviewing' when 'needs_changes' then 'waiting' when 'approved' then 'approved' when 'rejected' then 'rejected' else status end,
        assigned_to=coalesce(assigned_to,new.reviewed_by)
    where source_type='membership_application' and source_id=new.id::text;
    insert into public.status_history(entity_type,entity_id,from_status,to_status,changed_by,note)
    values('membership_application',new.id::text,old.status::text,new.status::text,auth.uid(),new.review_note);
  end if;
  return new;
end;
$$;
revoke execute on function private.membership_application_inbox_status() from public,anon,authenticated;
create trigger membership_application_sync_inbox after update on public.membership_applications for each row execute function private.membership_application_inbox_status();

create or replace function public.review_membership_application(target_application_id uuid,next_status text,note text default null)
returns public.membership_applications language plpgsql security definer set search_path=''
as $$
declare result public.membership_applications;
begin
  if not private.has_permission('membership.review') then raise exception 'Permission denied'; end if;
  if next_status not in ('reviewing','needs_changes','rejected') then raise exception 'Invalid review status'; end if;
  update public.membership_applications set status=next_status::public.membership_application_status,review_note=nullif(trim(note),''),reviewed_by=auth.uid(),reviewed_at=now()
  where id=target_application_id and status<>'approved' returning * into result;
  if result.id is null then raise exception 'Application not found or already approved'; end if;
  return result;
end;
$$;

create or replace function public.approve_membership_application(target_application_id uuid)
returns table(household_id uuid,membership_id uuid,membership_number text)
language plpgsql security definer set search_path=''
as $$
declare
  app public.membership_applications; family_member public.membership_application_members;
  new_household uuid; primary_person uuid; new_membership uuid; new_membership_number text;
begin
  if not private.has_permission('membership.approve') then raise exception 'Permission denied'; end if;
  select * into app from public.membership_applications where id=target_application_id for update;
  if app.id is null then raise exception 'Application not found'; end if;
  if app.status='approved' then raise exception 'Application already approved'; end if;

  insert into public.households(full_address,native_village,primary_mobile,source_application_id,created_by)
  values(app.full_address,app.native_village,app.mobile,app.id,auth.uid()) returning id into new_household;
  insert into public.people(household_id,is_primary,first_name,father_name,surname,age,gender,education,occupation,mobile,blood_group,native_village)
  values(new_household,true,app.first_name,app.father_name,app.surname,app.age,app.gender,app.education,app.occupation,app.mobile,app.blood_group,app.native_village)
  returning id into primary_person;
  update public.households set primary_person_id=primary_person where id=new_household;

  for family_member in select * from public.membership_application_members where application_id=app.id order by member_order loop
    insert into public.people(household_id,is_primary,relationship_to_primary,first_name,father_name,surname,age,gender,education,occupation,mobile,blood_group,native_village)
    values(new_household,false,family_member.relationship,family_member.first_name,family_member.father_name,family_member.surname,family_member.age,family_member.gender,family_member.education,family_member.occupation,family_member.mobile,family_member.blood_group,coalesce(family_member.native_village,app.native_village));
  end loop;

  insert into public.memberships(household_id,primary_person_id,source_application_id,created_by)
  values(new_household,primary_person,app.id,auth.uid()) returning id,memberships.membership_number into new_membership,new_membership_number;
  update public.membership_applications set status='approved',approved_household_id=new_household,reviewed_by=auth.uid(),reviewed_at=now(),review_note=null where id=app.id;
  return query select new_household,new_membership,new_membership_number;
end;
$$;
revoke all on function public.review_membership_application(uuid,text,text) from public;
revoke all on function public.approve_membership_application(uuid) from public;
grant execute on function public.review_membership_application(uuid,text,text) to authenticated;
grant execute on function public.approve_membership_application(uuid) to authenticated;
