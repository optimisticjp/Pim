create or replace function public.create_booking_document_upload_token(target_stay_request_id uuid, valid_hours integer default 48)
returns text language plpgsql security definer set search_path='' as $$
declare raw_token text; req public.stay_requests;
begin
  if not private.has_permission('sensitive_docs.manage') then raise exception 'Permission denied'; end if;
  if valid_hours<1 or valid_hours>168 then raise exception 'Token validity must be between 1 and 168 hours'; end if;
  select * into req from public.stay_requests where id=target_stay_request_id;
  if req.id is null then raise exception 'Stay request not found'; end if;
  if req.status in ('checked_out','rejected','cancelled') then raise exception 'Documents are not accepted for this request status'; end if;
  raw_token:=encode(extensions.gen_random_bytes(32),'hex');
  insert into public.booking_document_upload_tokens(stay_request_id,token_hash,expires_at,created_by)
  values(req.id,encode(extensions.digest(raw_token,'sha256'),'hex'),now()+make_interval(hours=>valid_hours),auth.uid());
  return raw_token;
end; $$;

create or replace function public.get_booking_document_upload_context(raw_token text)
returns table(request_number text, guest_id uuid, full_name text, uploaded_count bigint, expires_at timestamptz, remaining_uploads integer)
language sql security definer set search_path='' as $$
  with tok as (
    select t.stay_request_id,t.expires_at,(t.max_uploads-t.used_uploads)::integer remaining
    from public.booking_document_upload_tokens t
    where t.token_hash=encode(extensions.digest(raw_token,'sha256'),'hex') and t.revoked_at is null and t.expires_at>now() and t.used_uploads<t.max_uploads
    limit 1
  ), people as (
    select sr.id stay_request_id,sr.request_number,null::uuid guest_id,sr.applicant_name full_name,0 sort_order
    from tok join public.stay_requests sr on sr.id=tok.stay_request_id
    union all
    select g.stay_request_id,sr.request_number,g.id,g.full_name,g.guest_order
    from tok join public.stay_guests g on g.stay_request_id=tok.stay_request_id join public.stay_requests sr on sr.id=g.stay_request_id
  )
  select p.request_number,p.guest_id,p.full_name,
    (select count(*) from public.booking_documents d where d.stay_request_id=p.stay_request_id and d.guest_id is not distinct from p.guest_id and d.deleted_at is null) uploaded_count,
    tok.expires_at,tok.remaining
  from people p join tok on true order by p.sort_order;
$$;
revoke all on function public.get_booking_document_upload_context(text) from public;
grant execute on function public.get_booking_document_upload_context(text) to anon,authenticated;