create table if not exists private.public_form_attempts (
  id bigint generated always as identity primary key,
  form_type text not null,
  subject_hash text not null check (char_length(subject_hash)=64),
  created_at timestamptz not null default now()
);
create index if not exists public_form_attempts_subject_created_idx on private.public_form_attempts(form_type,subject_hash,created_at desc);

create or replace function public.consume_public_form_quota(target_form_type text,target_subject_hash text)
returns boolean
language plpgsql
security definer
set search_path=''
as $$
declare recent_count integer; daily_count integer; lock_key bigint;
begin
  if current_user <> 'service_role' then raise exception 'Service role required'; end if;
  if target_form_type not in ('membership','donation','stay','volunteer','veda_subscription','veda_change','veda_article','contact_preview','participation_preview') then raise exception 'Invalid form type'; end if;
  if target_subject_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid subject hash'; end if;
  lock_key := hashtextextended(target_form_type || ':' || target_subject_hash, 0);
  perform pg_advisory_xact_lock(lock_key);
  delete from private.public_form_attempts where created_at < now() - interval '2 days';
  select count(*) into recent_count from private.public_form_attempts where form_type=target_form_type and subject_hash=target_subject_hash and created_at >= now() - interval '15 minutes';
  select count(*) into daily_count from private.public_form_attempts where form_type=target_form_type and subject_hash=target_subject_hash and created_at >= now() - interval '24 hours';
  if recent_count >= 5 or daily_count >= 20 then return false; end if;
  insert into private.public_form_attempts(form_type,subject_hash) values(target_form_type,target_subject_hash);
  return true;
end; $$;
revoke all on function public.consume_public_form_quota(text,text) from public,anon,authenticated;
grant execute on function public.consume_public_form_quota(text,text) to service_role;
