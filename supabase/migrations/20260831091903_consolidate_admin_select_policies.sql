drop policy if exists admin_profiles_super_manage on public.admin_profiles;
create policy admin_profiles_super_insert on public.admin_profiles for insert to authenticated with check (private.is_super_admin());
create policy admin_profiles_super_update on public.admin_profiles for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy admin_profiles_super_delete on public.admin_profiles for delete to authenticated using (private.is_super_admin());

drop policy if exists assignments_super_manage on public.admin_role_assignments;
create policy assignments_super_insert on public.admin_role_assignments for insert to authenticated with check (private.is_super_admin());
create policy assignments_super_update on public.admin_role_assignments for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy assignments_super_delete on public.admin_role_assignments for delete to authenticated using (private.is_super_admin());

drop policy if exists permissions_super_manage on public.permissions;
create policy permissions_super_insert on public.permissions for insert to authenticated with check (private.is_super_admin());
create policy permissions_super_update on public.permissions for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy permissions_super_delete on public.permissions for delete to authenticated using (private.is_super_admin());

drop policy if exists role_permissions_super_manage on public.role_permissions;
create policy role_permissions_super_insert on public.role_permissions for insert to authenticated with check (private.is_super_admin());
create policy role_permissions_super_update on public.role_permissions for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy role_permissions_super_delete on public.role_permissions for delete to authenticated using (private.is_super_admin());

drop policy if exists roles_super_manage on public.roles;
create policy roles_super_insert on public.roles for insert to authenticated with check (private.is_super_admin());
create policy roles_super_update on public.roles for update to authenticated using (private.is_super_admin()) with check (private.is_super_admin());
create policy roles_super_delete on public.roles for delete to authenticated using (private.is_super_admin());
