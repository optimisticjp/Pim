create extension if not exists pgcrypto;

create type public.admin_status as enum ('invited','active','suspended');
create type public.inbox_priority as enum ('low','normal','high','urgent');
create type public.notification_status as enum ('unread','read','archived');

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  mobile text,
  is_super_admin boolean not null default false,
  status public.admin_status not null default 'invited',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_.-]+$'),
  name_gu text not null,
  name_en text not null,
  description_gu text,
  is_system boolean not null default false,
  is_archived boolean not null default false,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  code text primary key check (code ~ '^[a-z0-9_.-]+$'),
  module text not null,
  action text not null,
  name_gu text not null,
  description_gu text,
  dangerous boolean not null default false
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_code text not null references public.permissions(code) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_code)
);

create table public.admin_role_assignments (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  scope_type text not null default 'global' check (scope_type in ('global','ashram','module')),
  scope_key text,
  assigned_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (admin_id, role_id, scope_type, scope_key)
);

create table public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id text,
  category text not null,
  title text not null,
  subtitle text,
  contact_name text,
  contact_mobile text,
  ashram_key text,
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  status text not null default 'new',
  priority public.inbox_priority not null default 'normal',
  payload jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  trashed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inbox_items_active_idx on public.inbox_items (status, created_at desc) where archived_at is null and trashed_at is null;
create index inbox_items_assigned_idx on public.inbox_items (assigned_to, created_at desc) where archived_at is null and trashed_at is null;
create index inbox_items_category_idx on public.inbox_items (category, created_at desc) where trashed_at is null;

create table public.internal_notes (
  id bigint generated always as identity primary key,
  inbox_item_id uuid not null references public.inbox_items(id) on delete cascade,
  author_id uuid not null references public.admin_profiles(id) on delete restrict,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table public.status_history (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id text not null,
  from_status text,
  to_status text not null,
  changed_by uuid references public.admin_profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index status_history_entity_idx on public.status_history (entity_type, entity_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  href text,
  status public.notification_status not null default 'unread',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index notifications_admin_unread_idx on public.notifications (admin_id, created_at desc) where status = 'unread';

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_user_id, created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger admin_profiles_set_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger roles_set_updated_at before update on public.roles for each row execute function public.set_updated_at();
create trigger inbox_items_set_updated_at before update on public.inbox_items for each row execute function public.set_updated_at();

create or replace function public.is_active_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_profiles ap where ap.id = auth.uid() and ap.status = 'active');
$$;
create or replace function public.is_super_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_profiles ap where ap.id = auth.uid() and ap.status = 'active' and ap.is_super_admin = true);
$$;
create or replace function public.has_permission(requested_permission text, requested_scope_type text default null, requested_scope_key text default null)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_super_admin() or exists (
    select 1 from public.admin_role_assignments ara
    join public.roles r on r.id = ara.role_id and r.is_archived = false
    join public.role_permissions rp on rp.role_id = r.id
    where ara.admin_id = auth.uid() and rp.permission_code = requested_permission
      and (ara.scope_type = 'global' or requested_scope_type is null or (ara.scope_type = requested_scope_type and ara.scope_key is not distinct from requested_scope_key))
  );
$$;

grant execute on function public.is_active_admin() to authenticated;
grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.has_permission(text,text,text) to authenticated;

insert into public.permissions (code,module,action,name_gu,description_gu,dangerous) values
('admin.view','admin','view','એડમિન જુઓ','એડમિન યાદી અને ભૂમિકાઓ જોવાની મંજૂરી',false),
('admin.manage','admin','manage','એડમિન સંચાલન','એડમિન ઉમેરવા, સસ્પેન્ડ કરવા અને ભૂમિકાઓ બદલવાની મંજૂરી',true),
('roles.view','roles','view','ભૂમિકાઓ જુઓ','ભૂમિકાઓ અને પરવાનગીઓ જોવાની મંજૂરી',false),
('roles.manage','roles','manage','ભૂમિકાઓ સંચાલન','ભૂમિકાઓ અને પરવાનગીઓ બનાવવી અથવા બદલવી',true),
('inbox.view','inbox','view','ઇનબોક્સ જુઓ','આવેલી અરજીઓ જોવાની મંજૂરી',false),
('inbox.assign','inbox','assign','અરજી સોંપો','અરજી બીજા એડમિનને સોંપવાની મંજૂરી',false),
('inbox.update','inbox','update','અરજી અપડેટ','સ્થિતિ અને નોંધો બદલવાની મંજૂરી',false),
('inbox.archive','inbox','archive','અરજી આર્કાઇવ','અરજી આર્કાઇવ અથવા પુનઃસ્થાપિત કરવાની મંજૂરી',false),
('inbox.trash','inbox','trash','અરજી ટ્રેશ','અરજી ટ્રેશમાં મોકલવાની મંજૂરી',true),
('records.delete_permanently','system','delete','કાયમી ડિલીટ','રેકોર્ડ કાયમી રીતે નષ્ટ કરવાની મંજૂરી',true),
('audit.view','audit','view','ઓડિટ લોગ જુઓ','બદલાવનો ઇતિહાસ જોવાની મંજૂરી',false),
('exports.run','exports','export','એક્સપોર્ટ','CSV અથવા Excel ડેટા એક્સપોર્ટ કરવાની મંજૂરી',false),
('sensitive_docs.view','documents','view_sensitive','સંવેદનશીલ દસ્તાવેજ જુઓ','આધાર/PAN જેવા સંવેદનશીલ દસ્તાવેજ જોવાની મંજૂરી',true),
('cash.record','cash','record','નકદ રકમ નોંધો','નકદ રકમ પ્રાપ્ત થયાનું નોંધવાની મંજૂરી',true),
('receipts.issue','receipts','issue','રસીદ જારી કરો','અધિકૃત રસીદ બનાવવાની મંજૂરી',true),
('content.view','content','view','કન્ટેન્ટ જુઓ','ડ્રાફ્ટ અને પ્રકાશિત કન્ટેન્ટ જોવાની મંજૂરી',false),
('content.manage','content','manage','કન્ટેન્ટ સંપાદન','કન્ટેન્ટ ઉમેરવા અને સંપાદિત કરવાની મંજૂરી',false),
('content.publish','content','publish','કન્ટેન્ટ પ્રકાશિત','કન્ટેન્ટ જાહેર કરવાની મંજૂરી',true);

insert into public.roles (code,name_gu,name_en,description_gu,is_system) values
('committee_admin','સમિતિ એડમિન','Committee Admin','મુખ્ય એડમિન દ્વારા જરૂરી પરવાનગીઓ આપવાની આધારભૂત ભૂમિકા',true),
('content_editor','કન્ટેન્ટ સંપાદક','Content Editor','વેબસાઇટ કન્ટેન્ટ અને પ્રકાશનો સંભાળવા માટે',true),
('ashram_manager','આશ્રમ મેનેજર','Ashram Manager','નિર્ધારિત આશ્રમની અરજીઓ અને કામગીરી માટે',true),
('accounts_receipts','હિસાબ અને રસીદ','Accounts & Receipts','નકદ નોંધ અને રસીદ કામગીરી માટે',true),
('viewer','ફક્ત જોવું','Viewer','ફક્ત વાંચવાની મર્યાદિત ભૂમિકા',true);

with role_map as (select id, code from public.roles)
insert into public.role_permissions (role_id,permission_code)
select r.id, p.permission_code from role_map r cross join lateral (
  values
    ('content_editor','content.view'),('content_editor','content.manage'),
    ('ashram_manager','inbox.view'),('ashram_manager','inbox.assign'),('ashram_manager','inbox.update'),('ashram_manager','inbox.archive'),
    ('accounts_receipts','inbox.view'),('accounts_receipts','cash.record'),('accounts_receipts','receipts.issue'),('accounts_receipts','exports.run'),
    ('viewer','inbox.view'),('viewer','content.view'),
    ('committee_admin','inbox.view'),('committee_admin','inbox.assign'),('committee_admin','inbox.update'),('committee_admin','inbox.archive'),('committee_admin','content.view')
) as p(role_code, permission_code) where r.code = p.role_code;

alter table public.admin_profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.admin_role_assignments enable row level security;
alter table public.inbox_items enable row level security;
alter table public.internal_notes enable row level security;
alter table public.status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy admin_profiles_self_or_admin_select on public.admin_profiles for select to authenticated using (id = auth.uid() or public.has_permission('admin.view'));
create policy admin_profiles_super_manage on public.admin_profiles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy roles_active_admin_select on public.roles for select to authenticated using (public.is_active_admin());
create policy roles_super_manage on public.roles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy permissions_active_admin_select on public.permissions for select to authenticated using (public.is_active_admin());
create policy permissions_super_manage on public.permissions for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy role_permissions_active_admin_select on public.role_permissions for select to authenticated using (public.is_active_admin());
create policy role_permissions_super_manage on public.role_permissions for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy assignments_self_or_admin_select on public.admin_role_assignments for select to authenticated using (admin_id = auth.uid() or public.has_permission('admin.view'));
create policy assignments_super_manage on public.admin_role_assignments for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy inbox_select on public.inbox_items for select to authenticated using (public.has_permission('inbox.view'));
create policy inbox_insert on public.inbox_items for insert to authenticated with check (public.has_permission('inbox.update'));
create policy inbox_update on public.inbox_items for update to authenticated using (public.has_permission('inbox.update')) with check (public.has_permission('inbox.update'));
create policy inbox_delete_super on public.inbox_items for delete to authenticated using (public.is_super_admin());
create policy notes_select on public.internal_notes for select to authenticated using (public.has_permission('inbox.view'));
create policy notes_insert on public.internal_notes for insert to authenticated with check (author_id = auth.uid() and public.has_permission('inbox.update'));
create policy notes_update_own on public.internal_notes for update to authenticated using (author_id = auth.uid() and public.has_permission('inbox.update')) with check (author_id = auth.uid());
create policy notes_delete_super on public.internal_notes for delete to authenticated using (public.is_super_admin());
create policy status_history_select on public.status_history for select to authenticated using (public.has_permission('inbox.view') or public.has_permission('audit.view'));
create policy status_history_insert on public.status_history for insert to authenticated with check (changed_by = auth.uid() and public.is_active_admin());
create policy notifications_own_select on public.notifications for select to authenticated using (admin_id = auth.uid());
create policy notifications_own_update on public.notifications for update to authenticated using (admin_id = auth.uid()) with check (admin_id = auth.uid());
create policy notifications_admin_insert on public.notifications for insert to authenticated with check (public.is_active_admin());
create policy audit_select on public.audit_logs for select to authenticated using (public.has_permission('audit.view'));
create policy audit_insert on public.audit_logs for insert to authenticated with check (actor_user_id = auth.uid() and public.is_active_admin());

revoke all on public.audit_logs, public.admin_profiles, public.roles, public.permissions, public.role_permissions, public.admin_role_assignments, public.inbox_items, public.internal_notes, public.status_history, public.notifications from anon;
