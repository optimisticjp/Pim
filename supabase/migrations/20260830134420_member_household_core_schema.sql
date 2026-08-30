create type public.membership_application_status as enum ('submitted','reviewing','needs_changes','approved','rejected');
create type public.membership_status as enum ('active','inactive','archived');

create sequence public.membership_application_number_seq;
create sequence public.household_number_seq;
create sequence public.membership_number_seq;

create or replace function private.next_membership_application_number()
returns text language sql security definer set search_path=''
as $$ select 'APP-' || to_char(current_date,'YYYY') || '-' || lpad(nextval('public.membership_application_number_seq')::text,6,'0'); $$;

create or replace function private.next_household_number()
returns text language sql security definer set search_path=''
as $$ select 'HH-' || to_char(current_date,'YYYY') || '-' || lpad(nextval('public.household_number_seq')::text,6,'0'); $$;

create or replace function private.next_membership_number()
returns text language sql security definer set search_path=''
as $$ select 'MEM-' || to_char(current_date,'YYYY') || '-' || lpad(nextval('public.membership_number_seq')::text,6,'0'); $$;

create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default private.next_membership_application_number(),
  first_name text not null check (length(trim(first_name)) between 1 and 120),
  father_name text,
  surname text,
  full_address text not null check (length(trim(full_address)) between 4 and 1000),
  education text,
  mobile text not null check (length(regexp_replace(mobile,'[^0-9]','','g')) between 10 and 15),
  occupation text,
  native_village text not null check (length(trim(native_village)) between 1 and 160),
  blood_group text,
  gender text not null check (gender in ('male','female','other','prefer_not_to_say')),
  age smallint not null check (age between 0 and 120),
  family_member_count smallint not null default 0 check (family_member_count between 0 and 20),
  status public.membership_application_status not null default 'submitted',
  source text not null default 'website',
  review_note text,
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.membership_application_members (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.membership_applications(id) on delete cascade,
  member_order smallint not null check (member_order between 1 and 20),
  relationship text,
  first_name text not null check (length(trim(first_name)) between 1 and 120),
  father_name text,
  surname text,
  age smallint check (age between 0 and 120),
  gender text check (gender is null or gender in ('male','female','other','prefer_not_to_say')),
  education text,
  occupation text,
  mobile text,
  blood_group text,
  native_village text,
  created_at timestamptz not null default now(),
  unique(application_id, member_order)
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  household_number text not null unique default private.next_household_number(),
  primary_person_id uuid,
  full_address text not null,
  native_village text,
  primary_mobile text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  source_application_id uuid unique references public.membership_applications(id) on delete set null,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  is_primary boolean not null default false,
  relationship_to_primary text,
  first_name text not null,
  father_name text,
  surname text,
  age smallint check (age between 0 and 120),
  gender text check (gender is null or gender in ('male','female','other','prefer_not_to_say')),
  education text,
  occupation text,
  mobile text,
  blood_group text,
  native_village text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.households add constraint households_primary_person_fk foreign key (primary_person_id) references public.people(id) on delete set null;

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  membership_number text not null unique default private.next_membership_number(),
  household_id uuid not null references public.households(id) on delete cascade,
  primary_person_id uuid not null references public.people(id) on delete restrict,
  source_application_id uuid unique references public.membership_applications(id) on delete set null,
  status public.membership_status not null default 'active',
  started_at date not null default current_date,
  ended_at date,
  notes text,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_applications add column approved_household_id uuid references public.households(id) on delete set null;

create index membership_applications_status_idx on public.membership_applications(status, submitted_at desc);
create index membership_applications_mobile_idx on public.membership_applications(mobile);
create index membership_application_members_application_idx on public.membership_application_members(application_id, member_order);
create index people_household_idx on public.people(household_id, is_primary desc);
create index memberships_status_idx on public.memberships(status, created_at desc);

create trigger membership_applications_set_updated_at before update on public.membership_applications for each row execute function public.set_updated_at();
create trigger households_set_updated_at before update on public.households for each row execute function public.set_updated_at();
create trigger people_set_updated_at before update on public.people for each row execute function public.set_updated_at();
create trigger memberships_set_updated_at before update on public.memberships for each row execute function public.set_updated_at();
