insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('membership.view','membership','view','સભ્યપદ જુઓ','સભ્યપદ અરજીઓ અને સભ્ય રેકોર્ડ જોવાની મંજૂરી',false),
('membership.review','membership','review','સભ્યપદ અરજી તપાસો','અરજીની સ્થિતિ અને સમિતિ નોંધ બદલવાની મંજૂરી',false),
('membership.approve','membership','approve','સભ્યપદ મંજૂર કરો','અરજીમાંથી સત્તાવાર ઘર અને સભ્ય રેકોર્ડ બનાવવાની મંજૂરી',true),
('membership.manage','membership','manage','સભ્ય રેકોર્ડ સંપાદન','સત્તાવાર ઘર અને સભ્ય રેકોર્ડ બદલવાની મંજૂરી',true)
on conflict(code) do nothing;

insert into public.role_permissions(role_id,permission_code)
select r.id,v.permission_code from public.roles r join (values
('committee_admin','membership.view'),('committee_admin','membership.review'),
('ashram_manager','membership.view'),('viewer','membership.view')
) v(role_code,permission_code) on r.code=v.role_code
on conflict do nothing;

alter table public.membership_applications enable row level security;
alter table public.membership_application_members enable row level security;
alter table public.households enable row level security;
alter table public.people enable row level security;
alter table public.memberships enable row level security;

create policy membership_applications_admin_select on public.membership_applications for select to authenticated using (private.has_permission('membership.view'));
create policy membership_applications_admin_update on public.membership_applications for update to authenticated using (private.has_permission('membership.review')) with check (private.has_permission('membership.review'));
create policy membership_applications_super_delete on public.membership_applications for delete to authenticated using (private.is_super_admin());

create policy membership_application_members_admin_select on public.membership_application_members for select to authenticated using (private.has_permission('membership.view'));
create policy membership_application_members_super_delete on public.membership_application_members for delete to authenticated using (private.is_super_admin());

create policy households_admin_select on public.households for select to authenticated using (private.has_permission('membership.view'));
create policy households_admin_insert on public.households for insert to authenticated with check (private.has_permission('membership.manage'));
create policy households_admin_update on public.households for update to authenticated using (private.has_permission('membership.manage')) with check (private.has_permission('membership.manage'));
create policy households_super_delete on public.households for delete to authenticated using (private.is_super_admin());

create policy people_admin_select on public.people for select to authenticated using (private.has_permission('membership.view'));
create policy people_admin_insert on public.people for insert to authenticated with check (private.has_permission('membership.manage'));
create policy people_admin_update on public.people for update to authenticated using (private.has_permission('membership.manage')) with check (private.has_permission('membership.manage'));
create policy people_super_delete on public.people for delete to authenticated using (private.is_super_admin());

create policy memberships_admin_select on public.memberships for select to authenticated using (private.has_permission('membership.view'));
create policy memberships_admin_insert on public.memberships for insert to authenticated with check (private.has_permission('membership.manage'));
create policy memberships_admin_update on public.memberships for update to authenticated using (private.has_permission('membership.manage')) with check (private.has_permission('membership.manage'));
create policy memberships_super_delete on public.memberships for delete to authenticated using (private.is_super_admin());
