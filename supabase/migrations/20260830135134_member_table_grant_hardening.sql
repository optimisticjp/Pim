revoke all on table public.membership_applications, public.membership_application_members, public.households, public.people, public.memberships from anon;

revoke all on table public.membership_applications, public.membership_application_members, public.households, public.people, public.memberships from authenticated;
grant select, update, delete on public.membership_applications to authenticated;
grant select, delete on public.membership_application_members to authenticated;
grant select, insert, update, delete on public.households, public.people, public.memberships to authenticated;

revoke all on function public.submit_membership_application(jsonb) from public;
revoke all on function public.review_membership_application(uuid,text,text) from public;
revoke all on function public.approve_membership_application(uuid) from public;
grant execute on function public.submit_membership_application(jsonb) to anon, authenticated;
grant execute on function public.review_membership_application(uuid,text,text) to authenticated;
grant execute on function public.approve_membership_application(uuid) to authenticated;
