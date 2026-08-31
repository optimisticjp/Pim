create table public.guru_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_gu text not null,
  source_title_en text,
  qualification_gu text,
  portrait_url text,
  source_url text,
  source_status text not null default 'review_required',
  lineage_order integer,
  featured boolean not null default false,
  published boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guru_chapters (
  id uuid primary key default gen_random_uuid(),
  guru_profile_id uuid not null references public.guru_profiles(id) on delete cascade,
  slug text not null,
  title_gu text not null,
  summary_gu text,
  body_md text,
  sort_order integer not null default 100,
  status text not null default 'draft' check(status in ('draft','published','archived')),
  source_url text,
  review_required boolean not null default true,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(guru_profile_id,slug)
);

create table public.heritage_documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check(kind in ('historical_letter','history','granth','scan','other')),
  title_gu text not null,
  description_gu text,
  document_date date,
  date_label_gu text,
  file_url text,
  image_url text,
  source_url text,
  status text not null default 'draft' check(status in ('draft','published','archived')),
  sort_order integer not null default 100,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.media_folders(id) on delete set null,
  slug text not null unique,
  title_gu text not null,
  category text not null check(category in ('audio','image','pdf','video','youtube','mixed')),
  description_gu text,
  sort_order integer not null default 100,
  published boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  title_gu text not null,
  media_type text not null check(media_type in ('audio','image','pdf','video','youtube')),
  asset_url text not null,
  thumbnail_url text,
  mime_type text,
  duration_seconds integer,
  source_url text,
  source_label text,
  sort_order integer not null default 100,
  published boolean not null default false,
  archived_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index guru_profiles_lineage_idx on public.guru_profiles(lineage_order) where archived_at is null;
create index guru_chapters_profile_idx on public.guru_chapters(guru_profile_id,sort_order);
create index heritage_documents_public_idx on public.heritage_documents(status,sort_order);
create index media_folders_public_idx on public.media_folders(published,sort_order) where archived_at is null;
create index media_assets_folder_idx on public.media_assets(folder_id,published,sort_order) where archived_at is null;

insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('guru.view','guru','view','ગુરુ પરંપરા CMS જુઓ','ગુરુ પ્રોફાઇલ અને અધ્યાય જોવાની મંજૂરી',false),
('guru.manage','guru','manage','ગુરુ પરંપરા સંપાદન','ગુરુ પ્રોફાઇલ અને અધ્યાય સંપાદિત કરવાની મંજૂરી',false),
('guru.publish','guru','publish','ગુરુ પરંપરા પ્રકાશિત','ગુરુ પરંપરા જાહેર કરવાની મંજૂરી',true),
('heritage.manage','heritage','manage','હેરિટેજ સંચાલન','ઐતિહાસિક દસ્તાવેજો સંચાલિત કરવાની મંજૂરી',false),
('heritage.publish','heritage','publish','હેરિટેજ પ્રકાશિત','હેરિટેજ દસ્તાવેજ જાહેર કરવાની મંજૂરી',true),
('media.view','media','view','મીડિયા લાઇબ્રેરી જુઓ','મીડિયા ફોલ્ડર અને એસેટ જોવાની મંજૂરી',false),
('media.manage','media','manage','મીડિયા લાઇબ્રેરી સંપાદન','મીડિયા ફોલ્ડર અને એસેટ સંપાદિત કરવાની મંજૂરી',false),
('media.publish','media','publish','મીડિયા પ્રકાશિત','મીડિયા જાહેર કરવાની મંજૂરી',true)
on conflict(code) do update set module=excluded.module,action=excluded.action,name_gu=excluded.name_gu,description_gu=excluded.description_gu,dangerous=excluded.dangerous;

insert into public.role_permissions(role_id,permission_code)
select r.id,p.code from public.roles r join public.permissions p on
  (r.code='committee_admin' and p.code in ('guru.view','guru.manage','guru.publish','heritage.manage','heritage.publish','media.view','media.manage','media.publish')) or
  (r.code='content_editor' and p.code in ('guru.view','guru.manage','heritage.manage','media.view','media.manage')) or
  (r.code='viewer' and p.code in ('guru.view','media.view'))
on conflict do nothing;

insert into public.guru_profiles(slug,name_gu,source_title_en,qualification_gu,portrait_url,source_url,source_status,lineage_order,featured,published) values
('adi-shankaracharya','જગદગુરુ આદિ શંકરાચાર્યજી','Jagadguru Adi Shankaracharya',null,null,null,'user-requested-content-source-needed',0,true,false),
('madhavanandji','શ્રી ૧૦૦૮ સ્વામી શ્રી માધવાનંદ સાગરજી મહારાજ','Shree 1008 Swami Shree Madhavanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/madhavanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',10,true,true),
('chidanandji','શ્રી ૧૦૦૮ સ્વામી શ્રી ચિદાનંદ સાગરજી મહારાજ','Shree 1008 Swami Shree Chidanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/chidanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',20,true,true),
('shivohamji','શ્રી ૧૦૦૮ સ્વામી શ્રી શિવોહમ સાગરજી મહારાજ','Shree 1008 Swami Shree Shivoham Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/shivohamji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',30,true,true),
('akhandanandji','શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી અખંડાનંદ સાગરજી મહારાજ','Shree 1008 Mahamandaleshwar Swami Shree Akhandanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/akhandanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',40,true,true),
('jagdishanandji','શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી જગદીશાનંદ સાગરજી મહારાજ','Shree 1008 Mahamandaleshwar Swami Shree Jagdishanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/jagdishanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',50,true,true),
('prakashanandji','સ્વામી શ્રી પ્રકાશાનંદ સાગરજી મહારાજ','Swami Shree Prakashanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/prakashanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('hareshanandji','બ્રહ્મચારી શ્રી હરેશાનંદજી મહારાજ','Brahmachari Shree Hareshanandji Maharaj, Bhagwatacharya','ભાગવતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/hareshanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('vivekanandji','સ્વામી શ્રી વિવેકાનંદ સાગરજી મહારાજ','Swami Shree Vivekanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/vivekanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('bhumanandji','સ્વામી શ્રી ભૂમાનંદ સાગરજી મહારાજ','Swami Shree Bhumanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/bhumanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('mohananandji','સ્વામી શ્રી મોહનાનંદ સાગરજી મહારાજ','Swami Shree Mohananand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/mohananandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('sureshwaranandji','સ્વામી શ્રી સુરેશ્વરાનંદજી મહારાજ શાસ્ત્રી','Swami Shree Sureshwaranand Sagarji Maharaj Shastri, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/sureshwaranandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('brahmanandji','સ્વામી શ્રી બ્રહ્માનંદ સાગરજી મહારાજ','Swami Shree Brahmanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/brahmanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('hariharanandji','સ્વામી શ્રી હરિહરાનંદ સાગરજી મહારાજ','Swami Shree Hariharanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/hariharanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('jayanandji','બ્રહ્મચારી શ્રી જયાનંદ સાગરજી મહારાજ','Brahmachari Shree Jayanand Sagarji Maharaj, Vedantacharya','વેદાંતાચાર્ય','https://omshreemadhavanandji.org/content/swamiji/jayanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('devanandji','સ્વામી શ્રી દેવાનંદ સાગરજી મહારાજ','Swami Shree Devanand Sagarji Maharaj',null,'https://omshreemadhavanandji.org/content/swamiji/devanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('dayanandji','સ્વામી શ્રી દયાનંદ સાગરજી મહારાજ','Swami Shree Dayanand Sagarji Maharaj',null,'https://omshreemadhavanandji.org/content/swamiji/dayanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true),
('ganeshanandji','સ્વામી શ્રી ગણેશાનંદ સાગરજી મહારાજ','Swami Shree Ganeshanand Sagarji Maharaj',null,'https://omshreemadhavanandji.org/content/swamiji/ganeshanandji.jpg','https://omshreemadhavanandji.org/about_us.php','legacy-source-review-required',null,false,true)
on conflict(slug) do update set name_gu=excluded.name_gu,source_title_en=excluded.source_title_en,qualification_gu=excluded.qualification_gu,portrait_url=excluded.portrait_url,source_url=excluded.source_url,source_status=excluded.source_status,lineage_order=excluded.lineage_order,featured=excluded.featured;

with guru as (select id from public.guru_profiles where slug='adi-shankaracharya')
insert into public.guru_chapters(guru_profile_id,slug,title_gu,sort_order,status,review_required)
select guru.id,v.slug,v.title_gu,v.sort_order,'draft',true from guru cross join (values
('chapter-1','અધ્યાય 1',10),('chapter-2','અધ્યાય 2',20),('chapter-3','અધ્યાય 3',30),('chapter-4','અધ્યાય 4',40),('chapter-5','અધ્યાય 5',50)
) v(slug,title_gu,sort_order)
on conflict(guru_profile_id,slug) do nothing;

insert into public.media_folders(slug,title_gu,category,sort_order,published) values
('audio','ભજન અને આરતી','audio',10,true),
('photos','ફોટા અને પ્રસંગ સ્મૃતિ','image',70,true),
('literature','સાહિત્ય અને ગ્રંથ','pdf',80,true),
('katha','કથા અને પ્રવચન','youtube',90,true)
on conflict(slug) do update set title_gu=excluded.title_gu,category=excluded.category,sort_order=excluded.sort_order,published=excluded.published;

with parent as (select id from public.media_folders where slug='audio')
insert into public.media_folders(parent_id,slug,title_gu,category,sort_order,published)
select parent.id,v.slug,v.title_gu,'audio',v.sort_order,true from parent cross join (values
('audio-path','દૈનિક પાઠ',20),('audio-aarti','આરતી',30),('audio-stotra','સ્તોત્ર',40),('audio-bhajan','ભજન',50),('audio-kirtan','કીર્તન',60)
) v(slug,title_gu,sort_order)
on conflict(slug) do update set parent_id=excluded.parent_id,title_gu=excluded.title_gu,category=excluded.category,sort_order=excluded.sort_order,published=excluded.published;