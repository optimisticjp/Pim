create or replace function public.assign_stay_room(target_stay_request_id uuid, target_room_id uuid)
returns public.room_assignments
language plpgsql security definer set search_path = '' as $$
declare req public.stay_requests; room_row public.rooms; result public.room_assignments;
begin
  if not private.has_permission('stays.assign_room') then raise exception 'Permission denied'; end if;
  select * into req from public.stay_requests where id=target_stay_request_id for update;
  if req.id is null then raise exception 'Stay request not found'; end if;
  if req.status not in ('approved','room_assigned') then raise exception 'Stay request must be approved'; end if;
  select * into room_row from public.rooms where id=target_room_id and active=true and archived_at is null;
  if room_row.id is null or room_row.ashram_id<>req.ashram_id then raise exception 'Room not available for this ashram'; end if;
  if room_row.capacity<req.total_members then raise exception 'Room capacity too small'; end if;
  if exists(select 1 from public.room_blocks b where b.room_id=room_row.id and daterange(b.blocked_from,b.blocked_until,'[]') && daterange(req.check_in,req.check_out,'[)')) then raise exception 'Room is blocked'; end if;
  if exists(select 1 from public.room_assignments ra join public.stay_requests sr on sr.id=ra.stay_request_id where ra.room_id=room_row.id and ra.released_at is null and sr.id<>req.id and sr.status in ('approved','room_assigned','checked_in') and daterange(sr.check_in,sr.check_out,'[)') && daterange(req.check_in,req.check_out,'[)')) then raise exception 'Room already assigned for these dates'; end if;
  insert into public.room_assignments(stay_request_id,room_id,assigned_by)
  values(req.id,room_row.id,auth.uid())
  on conflict(stay_request_id,room_id) do update set released_at=null,assigned_by=auth.uid(),assigned_at=now()
  returning * into result;
  update public.stay_requests set status='room_assigned',assigned_to=coalesce(assigned_to,auth.uid()) where id=req.id;
  return result;
end; $$;

create or replace function public.release_stay_room(target_assignment_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_permission('stays.assign_room') then raise exception 'Permission denied'; end if;
  update public.room_assignments set released_at=now() where id=target_assignment_id;
end; $$;
