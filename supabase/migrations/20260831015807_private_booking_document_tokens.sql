insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('sensitive_docs.manage','documents','manage_sensitive','સંવેદનશીલ દસ્તાવેજ સંચાલન','રૂમ અરજી માટે ખાનગી ઓળખ દસ્તાવેજ અપલોડ લિંક બનાવવી અને સંચાલિત કરવી',true)
on conflict(code) do update set module=excluded.module,action=excluded.action,name_gu=excluded.name_gu,description_gu=excluded.description_gu,dangerous=excluded.dangerous;

insert into public.role_permissions(role_id,permission_code)
select r.id,p.code from public.roles r join public.permissions p on p.code in ('sensitive_docs.view','sensitive_docs.manage')
where r.code in ('committee_admin','ashram_manager') on conflict do nothing;

create table public.booking_document_upload_tokens (
  id uuid primary key default gen_random_uuid(),
  stay_request_id uuid not null references public.stay_requests(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  max_uploads smallint not null default 30 check(max_uploads between 1 and 30),
  used_uploads smallint not null default 0 check(used_uploads between 0 and 30),
  created_by uuid references public.admin_profiles(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index booking_document_upload_tokens_active_idx on public.booking_document_upload_tokens(stay_request_id,expires_at) where revoked_at is null;
alter table public.booking_document_upload_tokens enable row level security;
create policy booking_doc_tokens_select on public.booking_document_upload_tokens for select to authenticated using(private.has_permission('sensitive_docs.manage'));
create policy booking_doc_tokens_insert on public.booking_document_upload_tokens for insert to authenticated with check(private.has_permission('sensitive_docs.manage'));
create policy booking_doc_tokens_update on public.booking_document_upload_tokens for update to authenticated using(private.has_permission('sensitive_docs.manage')) with check(private.has_permission('sensitive_docs.manage'));
create policy booking_doc_tokens_super_delete on public.booking_document_upload_tokens for delete to authenticated using(private.is_super_admin());
revoke all on public.booking_document_upload_tokens from anon;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('booking-documents-private','booking-documents-private',false,5242880,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create or replace function public.create_booking_document_upload_token(target_stay_request_id uuid, valid_hours integer default 48)
returns text language plpgsql security definer set search_path='' as $$
declare raw_token text; req public.stay_requests;
begin
  if not private.has_permission('sensitive_docs.manage') then raise exception 'Permission denied'; end if;
  if valid_hours<1 or valid_hours>168 then raise exception 'Token validity must be between 1 and 168 hours'; end if;
  select * into req from public.stay_requests where id=target_stay_request_id;
  if req.id is null then raise exception 'Stay request not found'; end if;
  if req.status in ('checked_out','rejected','cancelled') then raise exception 'Documents are not accepted for this request status'; end if;
  raw_token:=encode(gen_random_bytes(32),'hex');
  insert into public.booking_document_upload_tokens(stay_request_id,token_hash,expires_at,created_by)
  values(req.id,encode(digest(raw_token,'sha256'),'hex'),now()+make_interval(hours=>valid_hours),auth.uid());
  return raw_token;
end; $$;
revoke all on function public.create_booking_document_upload_token(uuid,integer) from public,anon;
grant execute on function public.create_booking_document_upload_token(uuid,integer) to authenticated;
create trigger audit_booking_doc_tokens after insert or update or delete on public.booking_document_upload_tokens for each row execute function public.audit_admin_row_change();