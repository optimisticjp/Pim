revoke execute on function public.is_active_admin() from public, anon;
revoke execute on function public.is_super_admin() from public, anon;
revoke execute on function public.has_permission(text,text,text) from public, anon;

grant execute on function public.is_active_admin() to authenticated, service_role;
grant execute on function public.is_super_admin() to authenticated, service_role;
grant execute on function public.has_permission(text,text,text) to authenticated, service_role;
