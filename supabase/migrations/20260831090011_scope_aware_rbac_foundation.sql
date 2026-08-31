create or replace function private.has_global_permission(requested_permission text)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.roles r on r.id=ara.role_id and r.is_archived=false
    join public.role_permissions rp on rp.role_id=r.id
    where ara.admin_id=auth.uid()
      and rp.permission_code=requested_permission
      and ara.scope_type='global'
  );
$$;

create or replace function private.has_ashram_permission(requested_permission text,target_ashram_id uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.roles r on r.id=ara.role_id and r.is_archived=false
    join public.role_permissions rp on rp.role_id=r.id
    left join public.ashram_profiles a on a.id=target_ashram_id
    where ara.admin_id=auth.uid()
      and rp.permission_code=requested_permission
      and (
        ara.scope_type='global'
        or (
          target_ashram_id is not null
          and ara.scope_type='ashram'
          and ara.scope_key is not null
          and ara.scope_key in (a.slug,target_ashram_id::text)
        )
      )
  );
$$;

create or replace function private.has_ashram_slug_permission(requested_permission text,target_ashram_slug text)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select private.is_super_admin() or exists (
    select 1
    from public.admin_role_assignments ara
    join public.roles r on r.id=ara.role_id and r.is_archived=false
    join public.role_permissions rp on rp.role_id=r.id
    where ara.admin_id=auth.uid()
      and rp.permission_code=requested_permission
      and (
        ara.scope_type='global'
        or (
          target_ashram_slug is not null
          and ara.scope_type='ashram'
          and ara.scope_key=target_ashram_slug
        )
      )
  );
$$;

create or replace function private.can_access_stay(requested_permission text,target_stay_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select coalesce((
    select private.has_ashram_permission(requested_permission,sr.ashram_id)
    from public.stay_requests sr
    where sr.id=target_stay_request_id
  ),false);
$$;

create or replace function private.can_access_cash(requested_permission text,target_cash_transaction_id uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select coalesce((
    select case when ct.ashram_id is null
      then private.has_global_permission(requested_permission)
      else private.has_ashram_permission(requested_permission,ct.ashram_id)
    end
    from public.cash_transactions ct
    where ct.id=target_cash_transaction_id
  ),false);
$$;

revoke all on function private.has_global_permission(text) from public,anon;
revoke all on function private.has_ashram_permission(text,uuid) from public,anon;
revoke all on function private.has_ashram_slug_permission(text,text) from public,anon;
revoke all on function private.can_access_stay(text,uuid) from public,anon;
revoke all on function private.can_access_cash(text,uuid) from public,anon;
grant execute on function private.has_global_permission(text) to authenticated;
grant execute on function private.has_ashram_permission(text,uuid) to authenticated;
grant execute on function private.has_ashram_slug_permission(text,text) to authenticated;
grant execute on function private.can_access_stay(text,uuid) to authenticated;
grant execute on function private.can_access_cash(text,uuid) to authenticated;

drop policy if exists membership_applications_admin_select on public.membership_applications;
create policy membership_applications_admin_select on public.membership_applications for select to authenticated using(private.has_global_permission('membership.view'));
drop policy if exists membership_applications_admin_update on public.membership_applications;
create policy membership_applications_admin_update on public.membership_applications for update to authenticated using(private.has_global_permission('membership.review')) with check(private.has_global_permission('membership.review'));
drop policy if exists membership_application_members_admin_select on public.membership_application_members;
create policy membership_application_members_admin_select on public.membership_application_members for select to authenticated using(private.has_global_permission('membership.view'));
drop policy if exists households_admin_insert on public.households;
create policy households_admin_insert on public.households for insert to authenticated with check(private.has_global_permission('membership.manage'));
drop policy if exists households_admin_select on public.households;
create policy households_admin_select on public.households for select to authenticated using(private.has_global_permission('membership.view'));
drop policy if exists households_admin_update on public.households;
create policy households_admin_update on public.households for update to authenticated using(private.has_global_permission('membership.manage')) with check(private.has_global_permission('membership.manage'));
drop policy if exists people_admin_insert on public.people;
create policy people_admin_insert on public.people for insert to authenticated with check(private.has_global_permission('membership.manage'));
drop policy if exists people_admin_select on public.people;
create policy people_admin_select on public.people for select to authenticated using(private.has_global_permission('membership.view'));
drop policy if exists people_admin_update on public.people;
create policy people_admin_update on public.people for update to authenticated using(private.has_global_permission('membership.manage')) with check(private.has_global_permission('membership.manage'));
drop policy if exists memberships_admin_insert on public.memberships;
create policy memberships_admin_insert on public.memberships for insert to authenticated with check(private.has_global_permission('membership.manage'));
drop policy if exists memberships_admin_select on public.memberships;
create policy memberships_admin_select on public.memberships for select to authenticated using(private.has_global_permission('membership.view'));
drop policy if exists memberships_admin_update on public.memberships;
create policy memberships_admin_update on public.memberships for update to authenticated using(private.has_global_permission('membership.manage')) with check(private.has_global_permission('membership.manage'));

drop policy if exists veda_apps_select on public.veda_subscription_applications;
create policy veda_apps_select on public.veda_subscription_applications for select to authenticated using(private.has_global_permission('veda.view'));
drop policy if exists veda_apps_update on public.veda_subscription_applications;
create policy veda_apps_update on public.veda_subscription_applications for update to authenticated using(private.has_global_permission('veda.subscriptions.manage')) with check(private.has_global_permission('veda.subscriptions.manage'));
drop policy if exists veda_subscribers_insert on public.veda_subscribers;
create policy veda_subscribers_insert on public.veda_subscribers for insert to authenticated with check(private.has_global_permission('veda.approve'));
drop policy if exists veda_subscribers_select on public.veda_subscribers;
create policy veda_subscribers_select on public.veda_subscribers for select to authenticated using(private.has_global_permission('veda.view'));
drop policy if exists veda_subscribers_update on public.veda_subscribers;
create policy veda_subscribers_update on public.veda_subscribers for update to authenticated using(private.has_global_permission('veda.subscriptions.manage')) with check(private.has_global_permission('veda.subscriptions.manage'));
drop policy if exists veda_changes_select on public.veda_subscriber_change_requests;
create policy veda_changes_select on public.veda_subscriber_change_requests for select to authenticated using(private.has_global_permission('veda.view'));
drop policy if exists veda_changes_update on public.veda_subscriber_change_requests;
create policy veda_changes_update on public.veda_subscriber_change_requests for update to authenticated using(private.has_global_permission('veda.subscriptions.manage')) with check(private.has_global_permission('veda.subscriptions.manage'));
drop policy if exists veda_articles_select on public.veda_article_submissions;
create policy veda_articles_select on public.veda_article_submissions for select to authenticated using(private.has_global_permission('veda.view'));
drop policy if exists veda_articles_update on public.veda_article_submissions;
create policy veda_articles_update on public.veda_article_submissions for update to authenticated using(private.has_global_permission('veda.editorial.manage')) with check(private.has_global_permission('veda.editorial.manage'));
drop policy if exists veda_issues_insert on public.veda_issues;
create policy veda_issues_insert on public.veda_issues for insert to authenticated with check(private.has_global_permission('veda.issues.manage'));
drop policy if exists veda_issues_select on public.veda_issues;
create policy veda_issues_select on public.veda_issues for select to authenticated using(private.has_global_permission('veda.view'));
drop policy if exists veda_issues_update on public.veda_issues;
create policy veda_issues_update on public.veda_issues for update to authenticated using(private.has_global_permission('veda.issues.manage')) with check(private.has_global_permission('veda.issues.manage'));

drop policy if exists programme_circulars_admin_select on public.programme_circulars;
create policy programme_circulars_admin_select on public.programme_circulars for select to authenticated using(private.has_global_permission('programmes.view'));
drop policy if exists programme_circulars_admin_insert on public.programme_circulars;
create policy programme_circulars_admin_insert on public.programme_circulars for insert to authenticated with check(private.has_global_permission('programmes.manage'));
drop policy if exists programme_circulars_admin_update on public.programme_circulars;
create policy programme_circulars_admin_update on public.programme_circulars for update to authenticated using(private.has_global_permission('programmes.manage')) with check(private.has_global_permission('programmes.manage'));
drop policy if exists seva_categories_admin_insert on public.seva_categories;
create policy seva_categories_admin_insert on public.seva_categories for insert to authenticated with check(private.has_global_permission('seva.manage'));
drop policy if exists seva_categories_admin_update on public.seva_categories;
create policy seva_categories_admin_update on public.seva_categories for update to authenticated using(private.has_global_permission('seva.manage')) with check(private.has_global_permission('seva.manage'));

delete from public.role_permissions rp
using public.roles r
where rp.role_id=r.id and r.code='ashram_manager' and rp.permission_code='membership.view';
