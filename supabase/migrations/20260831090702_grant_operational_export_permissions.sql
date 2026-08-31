insert into public.role_permissions(role_id,permission_code)
select r.id,'exports.run' from public.roles r where r.code in ('ashram_manager','committee_admin')
on conflict do nothing;
