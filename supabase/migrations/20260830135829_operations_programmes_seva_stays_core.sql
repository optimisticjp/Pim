create sequence if not exists public.volunteer_application_number_seq;
create sequence if not exists public.stay_request_number_seq;

create or replace function private.next_volunteer_application_number()
returns text language sql security definer set search_path = '' as $$
  select 'VOL-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.volunteer_application_number_seq')::text,6,'0');
$$;

create or replace function private.next_stay_request_number()
returns text language sql security definer set search_path = '' as $$
  select 'STAY-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.stay_request_number_seq')::text,6,'0');
$$;

create table if not exists public.ashram_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_gu text not null,
  city_gu text not null,
  state_gu text,
  full_address text,
  office_phone text,
  manager_name text,
  manager_mobile text,
  map_url text,
  rules_md text,
  accepts_stays boolean not null default false,
  published boolean not null default false,
  verified boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programme_centres (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('satsang','bal_shibir','both')),
  title_gu text not null,
  ashram_id uuid references public.ashram_profiles(id) on delete set null,
  address_gu text not null,
  city_gu text not null,
  contact_name text,
  contact_mobile text,
  map_url text,
  schedule_text text,
  age_range_text text,
  notes text,
  published boolean not null default false,
  sort_order integer not null default 100,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists programme_centres_public_idx on public.programme_centres(published,kind,sort_order) where archived_at is null;

create table if not exists public.programme_circulars (
  id uuid primary key default gen_random_uuid(),
  title_gu text not null,
  category text not null check (category in ('current_programme','tour','bal_shibir','satsang','notice')),
  description_gu text,
  image_url text,
  pdf_url text,
  valid_from date,
  valid_until date,
  published boolean not null default false,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tithi_programmes (
  id uuid primary key default gen_random_uuid(),
  title_gu text not null,
  programme_type text not null check (programme_type in ('tithi','satsang','bal_shibir','special','tour','poonam')),
  programme_date date not null,
  weekday_gu text,
  tithi_name_gu text,
  tithi_number text,
  swamiji_name text,
  village_city_gu text not null,
  venue_gu text,
  map_url text,
  details_gu text,
  image_url text,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  ashram_id uuid references public.ashram_profiles(id) on delete set null,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tithi_programmes_date_idx on public.tithi_programmes(status,programme_date);

create table if not exists public.seva_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_gu text not null,
  description_gu text,
  published boolean not null default true,
  sort_order integer not null default 100,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seva_activities (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.seva_categories(id) on delete restrict,
  title_gu text not null,
  summary_gu text,
  details_gu text,
  ashram_id uuid references public.ashram_profiles(id) on delete set null,
  activity_date date,
  metric_label_gu text,
  metric_value text,
  cover_url text,
  published boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default private.next_volunteer_application_number(),
  full_name text not null,
  mobile text not null,
  full_address text not null,
  age smallint check (age between 12 and 100),
  available_from date,
  available_until date,
  time_slot text,
  preferred_ashram_id uuid references public.ashram_profiles(id) on delete set null,
  preferred_seva text[],
  skills text,
  notes text,
  status text not null default 'submitted' check (status in ('submitted','contacted','confirmed','completed','rejected','archived')),
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists volunteer_applications_status_idx on public.volunteer_applications(status,submitted_at desc);

create table if not exists public.stay_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default private.next_stay_request_number(),
  applicant_name text not null,
  mobile text not null,
  native_village text not null,
  full_address text not null,
  reference_name text,
  ashram_id uuid not null references public.ashram_profiles(id) on delete restrict,
  check_in date not null,
  check_out date not null,
  total_members smallint not null check (total_members between 1 and 30),
  takes_prasad boolean not null default false,
  breakfast_count smallint not null default 0,
  lunch_count smallint not null default 0,
  dinner_count smallint not null default 0,
  status text not null default 'new' check (status in ('new','reviewing','documents_required','waitlisted','approved','room_assigned','checked_in','checked_out','rejected','cancelled')),
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  admin_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out > check_in)
);
create index if not exists stay_requests_status_idx on public.stay_requests(status,submitted_at desc);
create index if not exists stay_requests_ashram_dates_idx on public.stay_requests(ashram_id,check_in,check_out);

create table if not exists public.stay_guests (
  id uuid primary key default gen_random_uuid(),
  stay_request_id uuid not null references public.stay_requests(id) on delete cascade,
  guest_order smallint not null check (guest_order between 1 and 30),
  full_name text not null,
  age smallint check (age between 0 and 120),
  relationship text,
  created_at timestamptz not null default now(),
  unique(stay_request_id,guest_order)
);

create table if not exists public.stay_meal_requirements (
  id uuid primary key default gen_random_uuid(),
  stay_request_id uuid not null references public.stay_requests(id) on delete cascade,
  meal_date date not null,
  breakfast_count smallint not null default 0,
  lunch_count smallint not null default 0,
  dinner_count smallint not null default 0,
  unique(stay_request_id,meal_date)
);

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  ashram_id uuid not null references public.ashram_profiles(id) on delete cascade,
  name_gu text not null,
  capacity smallint not null check (capacity between 1 and 100),
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  ashram_id uuid not null references public.ashram_profiles(id) on delete cascade,
  room_type_id uuid references public.room_types(id) on delete set null,
  room_number text not null,
  floor_label text,
  capacity smallint not null check (capacity between 1 and 100),
  notes text,
  active boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(ashram_id,room_number)
);

create table if not exists public.room_blocks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  blocked_from date not null,
  blocked_until date not null,
  reason text,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (blocked_until >= blocked_from)
);

create table if not exists public.room_assignments (
  id uuid primary key default gen_random_uuid(),
  stay_request_id uuid not null references public.stay_requests(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete restrict,
  assigned_by uuid references public.admin_profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  released_at timestamptz,
  unique(stay_request_id,room_id)
);
create index if not exists room_assignments_room_idx on public.room_assignments(room_id,assigned_at desc);

create table if not exists public.booking_documents (
  id uuid primary key default gen_random_uuid(),
  stay_request_id uuid not null references public.stay_requests(id) on delete cascade,
  guest_id uuid references public.stay_guests(id) on delete set null,
  document_type text not null default 'aadhaar',
  storage_provider text not null default 'supabase',
  storage_key text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  uploaded_at timestamptz not null default now(),
  delete_after timestamptz,
  deleted_at timestamptz
);

create trigger ashram_profiles_set_updated_at before update on public.ashram_profiles for each row execute function public.set_updated_at();
create trigger programme_centres_set_updated_at before update on public.programme_centres for each row execute function public.set_updated_at();
create trigger programme_circulars_set_updated_at before update on public.programme_circulars for each row execute function public.set_updated_at();
create trigger tithi_programmes_set_updated_at before update on public.tithi_programmes for each row execute function public.set_updated_at();
create trigger seva_categories_set_updated_at before update on public.seva_categories for each row execute function public.set_updated_at();
create trigger seva_activities_set_updated_at before update on public.seva_activities for each row execute function public.set_updated_at();
create trigger volunteer_applications_set_updated_at before update on public.volunteer_applications for each row execute function public.set_updated_at();
create trigger stay_requests_set_updated_at before update on public.stay_requests for each row execute function public.set_updated_at();
create trigger room_types_set_updated_at before update on public.room_types for each row execute function public.set_updated_at();
create trigger rooms_set_updated_at before update on public.rooms for each row execute function public.set_updated_at();
