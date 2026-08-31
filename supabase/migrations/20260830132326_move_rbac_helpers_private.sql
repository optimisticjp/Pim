create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.id = auth.uid() and ap.status = 'active'
  );
$$;

create or replace function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.id = auth.uid() and ap.status = 'active' and ap.is_super_admin = true
  );
$$;

create or replace function private.has_permission(requested_permission text, requested_scope_type text default null, requested_scope_key text default null)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.roles r on r.id = ara.role_id and r.is_archived = false
    join public.role_permissions rp on rp.role_id = r.id
    where ara.admin_id = auth.uid()
      and rp.permission_code = requested_permission
      and (
        ara.scope_type = 'global'
        or requested_scope_type is null
        or (ara.scope_type = requested_scope_type and ara.scope_key is not distinct from requested_scope_key)
      )
  );
$$;

revoke all on function private.is_active_admin() from public, anon;
revoke all on function private.is_super_admin() from public, anon;
revoke all on function private.has_permission(text,text,text) from public, anon;
grant execute on function private.is_active_admin() to authenticated, service_role;
grant execute on function private.is_super_admin() to authenticated, service_role;
grant execute on function private.has_permission(text,text,text) to authenticated, service_role;

alter policy admin_profiles_self_or_admin_select on public.admin_profiles using (id = auth.uid() or private.has_permission('admin.view'));
alter policy admin_profiles_super_manage on public.admin_profiles using (private.is_super_admin()) with check (private.is_super_admin());
alter policy roles_active_admin_select on public.roles using (private.is_active_admin());
alter policy roles_super_manage on public.roles using (private.is_super_admin()) with check (private.is_super_admin());
alter policy permissions_active_admin_select on public.permissions using (private.is_active_admin());
alter policy permissions_super_manage on public.permissions using (private.is_super_admin()) with check (private.is_super_admin());
alter policy role_permissions_active_admin_select on public.role_permissions using (private.is_active_admin());
alter policy role_permissions_super_manage on public.role_permissions using (private.is_super_admin()) with check (private.is_super_admin());
alter policy assignments_self_or_admin_select on public.admin_role_assignments using (admin_id = auth.uid() or private.has_permission('admin.view'));
alter policy assignments_super_manage on public.admin_role_assignments using (private.is_super_admin()) with check (private.is_super_admin());
alter policy inbox_select on public.inbox_items using (private.has_permission('inbox.view'));
alter policy inbox_insert on public.inbox_items with check (private.has_permission('inbox.update'));
alter policy inbox_update on public.inbox_items using (private.has_permission('inbox.update')) with check (private.has_permission('inbox.update'));
alter policy inbox_delete_super on public.inbox_items using (private.is_super_admin());
alter policy notes_select on public.internal_notes using (private.has_permission('inbox.view'));
alter policy notes_insert on public.internal_notes with check (author_id = auth.uid() and private.has_permission('inbox.update'));
alter policy notes_update_own on public.internal_notes using (author_id = auth.uid() and private.has_permission('inbox.update')) with check (author_id = auth.uid());
alter policy notes_delete_super on public.internal_notes using (private.is_super_admin());
alter policy status_history_select on public.status_history using (private.has_permission('inbox.view') or private.has_permission('audit.view'));
alter policy status_history_insert on public.status_history with check (changed_by = auth.uid() and private.is_active_admin());
alter policy notifications_admin_insert on public.notifications with check (private.is_active_admin());
alter policy audit_select on public.audit_logs using (private.has_permission('audit.view'));

drop function if exists public.has_permission(text,text,text);
drop function if exists public.is_super_admin();
drop function if exists public.is_active_admin();
