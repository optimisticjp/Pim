create sequence public.veda_subscription_application_seq;
create sequence public.veda_subscriber_number_seq;
create sequence public.veda_change_request_seq;
create sequence public.veda_article_submission_seq;

create or replace function private.next_veda_subscription_application_number()
returns text language sql security definer set search_path='' as $$
  select 'VR-APP-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.veda_subscription_application_seq')::text,6,'0');
$$;
create or replace function private.next_veda_subscriber_number()
returns text language sql security definer set search_path='' as $$
  select 'VR-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.veda_subscriber_number_seq')::text,6,'0');
$$;
create or replace function private.next_veda_change_request_number()
returns text language sql security definer set search_path='' as $$
  select 'VR-CHG-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.veda_change_request_seq')::text,6,'0');
$$;
create or replace function private.next_veda_article_submission_number()
returns text language sql security definer set search_path='' as $$
  select 'VR-ART-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.veda_article_submission_seq')::text,6,'0');
$$;

create table public.veda_subscription_applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default private.next_veda_subscription_application_number(),
  full_name text not null,
  mobile text not null,
  village text,
  full_address text not null,
  pincode text not null,
  status text not null default 'submitted' check (status in ('submitted','reviewing','cash_pending','cash_received','active','rejected','cancelled','archived')),
  review_note text,
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  subscriber_id uuid,
  cash_transaction_id uuid references public.cash_transactions(id) on delete set null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index veda_subscription_status_idx on public.veda_subscription_applications(status,submitted_at desc);
create trigger veda_subscription_updated before update on public.veda_subscription_applications for each row execute function public.set_updated_at();

create table public.veda_subscribers (
  id uuid primary key default gen_random_uuid(),
  subscriber_number text not null unique default private.next_veda_subscriber_number(),
  full_name text not null,
  mobile text not null,
  village text,
  full_address text not null,
  pincode text not null,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  source_application_id uuid unique references public.veda_subscription_applications(id) on delete set null,
  started_at date not null default current_date,
  ended_at date,
  notes text,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger veda_subscribers_updated before update on public.veda_subscribers for each row execute function public.set_updated_at();
alter table public.veda_subscription_applications add constraint veda_subscription_subscriber_fk foreign key(subscriber_id) references public.veda_subscribers(id) on delete set null;

create table public.veda_sensitive_data (
  id uuid primary key default gen_random_uuid(),
  application_id uuid unique references public.veda_subscription_applications(id) on delete cascade,
  subscriber_id uuid unique references public.veda_subscribers(id) on delete cascade,
  pan_number text check (pan_number is null or length(trim(pan_number)) between 8 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (application_id is not null or subscriber_id is not null)
);
create trigger veda_sensitive_updated before update on public.veda_sensitive_data for each row execute function public.set_updated_at();

create table public.veda_subscriber_change_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default private.next_veda_change_request_number(),
  subscriber_number text,
  mobile text not null,
  change_type text not null check (change_type in ('name','address','name_and_address','other')),
  requested_name text,
  requested_address text,
  requested_pincode text,
  note text,
  status text not null default 'submitted' check (status in ('submitted','reviewing','approved','rejected','completed','archived')),
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index veda_change_status_idx on public.veda_subscriber_change_requests(status,submitted_at desc);
create trigger veda_change_updated before update on public.veda_subscriber_change_requests for each row execute function public.set_updated_at();

create table public.veda_article_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_number text not null unique default private.next_veda_article_submission_number(),
  author_name text not null,
  mobile text not null,
  title text not null,
  body_text text,
  attachment_url text,
  note text,
  status text not null default 'submitted' check (status in ('submitted','under_review','changes_requested','accepted','published','rejected','archived')),
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index veda_article_status_idx on public.veda_article_submissions(status,submitted_at desc);
create trigger veda_article_updated before update on public.veda_article_submissions for each row execute function public.set_updated_at();

create table public.veda_issues (
  id uuid primary key default gen_random_uuid(),
  issue_date date not null unique,
  issue_year smallint not null,
  issue_month smallint not null check (issue_month between 1 and 12),
  title_gu text not null default 'વેદ રહસ્ય',
  pdf_url text,
  cover_url text,
  source_url text,
  published boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index veda_issues_public_idx on public.veda_issues(published,issue_date desc) where archived_at is null;
create trigger veda_issues_updated before update on public.veda_issues for each row execute function public.set_updated_at();

insert into public.veda_issues(issue_date,issue_year,issue_month,title_gu,pdf_url,source_url,published)
select d::date,extract(year from d)::smallint,extract(month from d)::smallint,'વેદ રહસ્ય','https://omshreemadhavanandji.org/content/pub_vedarahasya/Ved-Rahasya-'||to_char(d,'FMMonth-YYYY')||'.pdf','https://omshreemadhavanandji.org/publication_vedarahasya.php',true
from generate_series(date '2014-07-01',date '2018-04-01',interval '1 month') d
on conflict(issue_date) do nothing;

insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('veda.view','veda','view','વેદ રહસ્ય જુઓ','સબ્સ્ક્રિપ્શન, requests અને editorial queue જોવાની મંજૂરી',false),
('veda.subscriptions.manage','veda','subscriptions_manage','વેદ રહસ્ય સભ્ય વ્યવસ્થા','સબ્સ્ક્રિપ્શન અરજી અને subscriber records સંપાદિત કરવાની મંજૂરી',false),
('veda.approve','veda','approve','વેદ રહસ્ય સભ્ય મંજૂર','cash/receipt પછી subscriber સક્રિય કરવાની મંજૂરી',true),
('veda.editorial.manage','veda','editorial_manage','વેદ રહસ્ય લેખ વ્યવસ્થા','લેખ અને સુધારા requests સંચાલિત કરવાની મંજૂરી',false),
('veda.issues.manage','veda','issues_manage','વેદ રહસ્ય અંક સંચાલન','PDF અંક ઉમેરવા અને સંપાદિત કરવાની મંજૂરી',false)
on conflict(code) do update set module=excluded.module,action=excluded.action,name_gu=excluded.name_gu,description_gu=excluded.description_gu,dangerous=excluded.dangerous;

with pairs(role_code,permission_code) as (values
('committee_admin','veda.view'),('committee_admin','veda.subscriptions.manage'),('committee_admin','veda.approve'),('committee_admin','veda.editorial.manage'),('committee_admin','veda.issues.manage'),
('accounts_receipts','veda.view'),('accounts_receipts','veda.subscriptions.manage'),
('content_editor','veda.view'),('content_editor','veda.editorial.manage'),('content_editor','veda.issues.manage'),
('viewer','veda.view'))
insert into public.role_permissions(role_id,permission_code)
select r.id,p.permission_code from pairs p join public.roles r on r.code=p.role_code on conflict do nothing;
