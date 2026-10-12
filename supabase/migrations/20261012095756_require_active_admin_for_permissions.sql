create or replace function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.status = 'active'
      and ap.is_super_admin = true
      and ap.deleted_at is null
  );
$$;

create or replace function private.has_permission(
  requested_permission text,
  requested_scope_type text default null,
  requested_scope_key text default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.admin_profiles ap
      on ap.id = ara.admin_id
     and ap.status = 'active'
     and ap.deleted_at is null
    join public.roles r
      on r.id = ara.role_id
     and r.is_archived = false
    join public.role_permissions rp
      on rp.role_id = r.id
    where ara.admin_id = auth.uid()
      and rp.permission_code = requested_permission
      and (
        ara.scope_type = 'global'
        or requested_scope_type is null
        or (
          ara.scope_type = requested_scope_type
          and ara.scope_key is not distinct from requested_scope_key
        )
      )
  );
$$;

create or replace function private.has_global_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.admin_profiles ap
      on ap.id = ara.admin_id
     and ap.status = 'active'
     and ap.deleted_at is null
    join public.roles r
      on r.id = ara.role_id
     and r.is_archived = false
    join public.role_permissions rp
      on rp.role_id = r.id
    where ara.admin_id = auth.uid()
      and rp.permission_code = requested_permission
      and ara.scope_type = 'global'
  );
$$;

create or replace function private.has_ashram_permission(
  requested_permission text,
  target_ashram_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.admin_profiles ap
      on ap.id = ara.admin_id
     and ap.status = 'active'
     and ap.deleted_at is null
    join public.roles r
      on r.id = ara.role_id
     and r.is_archived = false
    join public.role_permissions rp
      on rp.role_id = r.id
    left join public.ashram_profiles a
      on a.id = target_ashram_id
    where ara.admin_id = auth.uid()
      and rp.permission_code = requested_permission
      and (
        ara.scope_type = 'global'
        or (
          target_ashram_id is not null
          and ara.scope_type = 'ashram'
          and ara.scope_key is not null
          and ara.scope_key in (a.slug, target_ashram_id::text)
        )
      )
  );
$$;

create or replace function private.has_ashram_slug_permission(
  requested_permission text,
  target_ashram_slug text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.admin_profiles ap
      on ap.id = ara.admin_id
     and ap.status = 'active'
     and ap.deleted_at is null
    join public.roles r
      on r.id = ara.role_id
     and r.is_archived = false
    join public.role_permissions rp
      on rp.role_id = r.id
    where ara.admin_id = auth.uid()
      and rp.permission_code = requested_permission
      and (
        ara.scope_type = 'global'
        or (
          target_ashram_slug is not null
          and ara.scope_type = 'ashram'
          and ara.scope_key = target_ashram_slug
        )
      )
  );
$$;
