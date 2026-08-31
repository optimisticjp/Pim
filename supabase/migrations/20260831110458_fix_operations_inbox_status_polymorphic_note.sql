create or replace function private.operations_inbox_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  new_row jsonb := to_jsonb(new);
  old_row jsonb := to_jsonb(old);
  next_status text := new_row->>'status';
  prior_status text := old_row->>'status';
  note_value text;
  target_assignee uuid;
begin
  if next_status is distinct from prior_status then
    if tg_table_name = 'volunteer_applications' then
      target_assignee := nullif(new_row->>'reviewed_by','')::uuid;
      update public.inbox_items
        set status = next_status,
            assigned_to = coalesce(assigned_to, target_assignee)
        where source_type='volunteer_application' and source_id=new_row->>'id';
      note_value := new_row->>'review_note';
    elsif tg_table_name = 'stay_requests' then
      target_assignee := nullif(new_row->>'assigned_to','')::uuid;
      update public.inbox_items
        set status = next_status,
            assigned_to = coalesce(assigned_to, target_assignee)
        where source_type='stay_request' and source_id=new_row->>'id';
      note_value := new_row->>'admin_note';
    end if;

    insert into public.status_history(entity_type,entity_id,from_status,to_status,changed_by,note)
    values(tg_table_name,new_row->>'id',prior_status,next_status,auth.uid(),note_value);
  end if;
  return new;
end;
$function$;
