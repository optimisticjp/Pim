alter table public.admin_profiles
  add column if not exists password_set_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_profiles_approved_by_fkey'
      and conrelid = 'public.admin_profiles'::regclass
  ) then
    alter table public.admin_profiles
      add constraint admin_profiles_approved_by_fkey
      foreign key (approved_by) references public.admin_profiles(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_profiles_deleted_by_fkey'
      and conrelid = 'public.admin_profiles'::regclass
  ) then
    alter table public.admin_profiles
      add constraint admin_profiles_deleted_by_fkey
      foreign key (deleted_by) references public.admin_profiles(id) on delete set null;
  end if;
end
$$;

create index if not exists admin_profiles_live_status_idx
  on public.admin_profiles(status, is_super_admin)
  where deleted_at is null;

create or replace function private.enforce_admin_profile_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  approver_ok boolean;
begin
  if tg_op = 'UPDATE' and old.is_super_admin then
    if not new.is_super_admin or new.status <> 'active' or new.deleted_at is not null then
      raise exception 'Super Admin cannot be disabled, demoted, or removed';
    end if;
  end if;

  if new.is_super_admin then
    if new.status <> 'active' or new.deleted_at is not null then
      raise exception 'Super Admin must remain active';
    end if;
    return new;
  end if;

  if new.deleted_at is not null and new.status <> 'suspended' then
    raise exception 'Removed staff must be suspended';
  end if;

  if new.status = 'active' then
    if new.deleted_at is not null then
      raise exception 'Removed staff cannot be activated';
    end if;
    if new.password_set_at is null then
      raise exception 'Staff must set a password before activation';
    end if;
    if new.approved_at is null or new.approved_by is null then
      raise exception 'Staff must be approved by the Super Admin before activation';
    end if;

    select exists (
      select 1
      from public.admin_profiles p
      where p.id = new.approved_by
        and p.is_super_admin
        and p.status = 'active'
        and p.deleted_at is null
    ) into approver_ok;

    if not approver_ok then
      raise exception 'Approval must come from an active Super Admin';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_admin_profile_lifecycle() from public, anon, authenticated;

drop trigger if exists admin_profiles_lifecycle_guard on public.admin_profiles;
create trigger admin_profiles_lifecycle_guard
before insert or update on public.admin_profiles
for each row execute function private.enforce_admin_profile_lifecycle();
