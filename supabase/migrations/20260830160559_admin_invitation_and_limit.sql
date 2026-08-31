create table public.admin_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(trim(email)) and position('@' in email) > 1),
  display_name text not null check (length(trim(display_name)) between 1 and 160),
  role_id uuid references public.roles(id) on delete set null,
  scope_type text not null default 'global' check (scope_type in ('global','ashram','module')),
  scope_key text,
  status text not null default 'pending' check (status in ('pending','sent','accepted','revoked','expired','failed')),
  invited_by uuid not null references public.admin_profiles(id) on delete restrict,
  auth_user_id uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index admin_invitations_open_email_idx on public.admin_invitations(email) where status in ('pending','sent');
create trigger admin_invitations_set_updated_at before update on public.admin_invitations for each row execute function public.set_updated_at();

alter table public.admin_invitations enable row level security;
create policy admin_invitations_super_select on public.admin_invitations for select to authenticated using(private.is_super_admin());
create policy admin_invitations_super_insert on public.admin_invitations for insert to authenticated with check(private.is_super_admin() and invited_by=auth.uid());
create policy admin_invitations_super_update on public.admin_invitations for update to authenticated using(private.is_super_admin()) with check(private.is_super_admin());
create policy admin_invitations_super_delete on public.admin_invitations for delete to authenticated using(private.is_super_admin());
revoke all on public.admin_invitations from anon;
revoke all on public.admin_invitations from authenticated;
grant select,insert,update,delete on public.admin_invitations to authenticated;

create or replace function private.enforce_admin_limit()
returns trigger language plpgsql security definer set search_path='' as $$
declare active_count int;
begin
  if new.status='active' and (tg_op='INSERT' or old.status is distinct from 'active') then
    select count(*) into active_count from public.admin_profiles where status='active' and id<>new.id;
    if active_count >= 10 then raise exception 'Maximum of 10 active admins reached'; end if;
  end if;
  return new;
end; $$;
revoke all on function private.enforce_admin_limit() from public,anon,authenticated;
create trigger admin_profiles_limit_guard before insert or update of status on public.admin_profiles for each row execute function private.enforce_admin_limit();

create trigger audit_admin_invitations after insert or update or delete on public.admin_invitations for each row execute function public.audit_admin_row_change();
