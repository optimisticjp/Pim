alter table public.admin_role_assignments
  drop constraint if exists admin_role_assignments_admin_id_role_id_scope_type_scope_key_key;

alter table public.admin_role_assignments
  add constraint admin_role_assignments_unique_scope
  unique nulls not distinct (admin_id, role_id, scope_type, scope_key);
