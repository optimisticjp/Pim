insert into public.permissions(code,module,action,name_gu,description_gu,dangerous) values
('ashrams.manage','ashrams','manage','આશ્રમ કામગીરી સંચાલન','આશ્રમ વિગતો, રૂમ અને રહેવાની વ્યવસ્થા સંચાલિત કરવાની મંજૂરી',true),
('programmes.view','programmes','view','કાર્યક્રમ વ્યવસ્થા જુઓ','સત્સંગ, બાળ શિબિર અને circular માહિતી જોવાની મંજૂરી',false),
('programmes.manage','programmes','manage','કાર્યક્રમ વ્યવસ્થા સંપાદન','કાર્યક્રમ કેન્દ્ર અને circular ઉમેરવા/સંપાદિત કરવાની મંજૂરી',false),
('programmes.publish','programmes','publish','કાર્યક્રમ પ્રકાશિત','કાર્યક્રમ અથવા circular જાહેર કરવાની મંજૂરી',true),
('events.manage','events','manage','તિથિ અને ઉત્સવ સંપાદન','તિથિ, પૂનમ અને પ્રવાસ કાર્યક્રમ સંપાદિત કરવાની મંજૂરી',false),
('events.publish','events','publish','તિથિ અને ઉત્સવ પ્રકાશિત','તિથિ અને ઉત્સવ જાહેર કરવાની મંજૂરી',true),
('seva.manage','seva','manage','સેવા પ્રવૃત્તિ સંચાલન','સેવા categories અને activities સંચાલિત કરવાની મંજૂરી',false),
('volunteer.view','volunteer','view','સ્વયંસેવક અરજીઓ જુઓ','સ્વયંસેવક અરજીઓ જોવાની મંજૂરી',false),
('volunteer.review','volunteer','review','સ્વયંસેવક અરજી સંચાલન','સ્વયંસેવક અરજીની સ્થિતિ અને નોંધ બદલવાની મંજૂરી',false),
('stays.view','stays','view','રહેવાની અરજીઓ જુઓ','આશ્રમ રહેવાની અરજીઓ અને મહેમાનો જોવાની મંજૂરી',false),
('stays.review','stays','review','રહેવાની અરજી તપાસો','રહેવાની અરજી મંજૂર/નામંજૂર અને સ્થિતિ સંચાલિત કરવાની મંજૂરી',false),
('stays.assign_room','stays','assign','રૂમ સોંપો','મંજૂર રહેવાની અરજીને રૂમ સોંપવાની મંજૂરી',true)
on conflict(code) do update set module=excluded.module,action=excluded.action,name_gu=excluded.name_gu,description_gu=excluded.description_gu,dangerous=excluded.dangerous;

with pairs(role_code,permission_code) as (values
('ashram_manager','ashrams.manage'),('ashram_manager','programmes.view'),('ashram_manager','stays.assign_room'),('ashram_manager','stays.review'),('ashram_manager','stays.view'),('ashram_manager','volunteer.view'),
('committee_admin','events.manage'),('committee_admin','programmes.manage'),('committee_admin','programmes.view'),('committee_admin','stays.review'),('committee_admin','stays.view'),('committee_admin','volunteer.review'),('committee_admin','volunteer.view'),
('content_editor','events.manage'),('content_editor','programmes.manage'),('content_editor','programmes.view'),('content_editor','seva.manage'),
('viewer','programmes.view'),('viewer','stays.view'),('viewer','volunteer.view')
)
insert into public.role_permissions(role_id,permission_code)
select r.id,p.permission_code from pairs p join public.roles r on r.code=p.role_code
on conflict do nothing;

alter table public.ashram_profiles enable row level security;
alter table public.programme_centres enable row level security;
alter table public.programme_circulars enable row level security;
alter table public.tithi_programmes enable row level security;
alter table public.seva_categories enable row level security;
alter table public.seva_activities enable row level security;
alter table public.volunteer_applications enable row level security;
alter table public.stay_requests enable row level security;
alter table public.stay_guests enable row level security;
alter table public.stay_meal_requirements enable row level security;
alter table public.room_types enable row level security;
alter table public.rooms enable row level security;
alter table public.room_blocks enable row level security;
alter table public.room_assignments enable row level security;
alter table public.booking_documents enable row level security;

create policy ashram_profiles_admin_select on public.ashram_profiles for select to authenticated using(private.is_active_admin());
create policy ashram_profiles_admin_insert on public.ashram_profiles for insert to authenticated with check(private.has_permission('ashrams.manage'));
create policy ashram_profiles_admin_update on public.ashram_profiles for update to authenticated using(private.has_permission('ashrams.manage')) with check(private.has_permission('ashrams.manage'));

create policy programme_centres_admin_select on public.programme_centres for select to authenticated using(private.has_permission('programmes.view'));
create policy programme_centres_admin_insert on public.programme_centres for insert to authenticated with check(private.has_permission('programmes.manage'));
create policy programme_centres_admin_update on public.programme_centres for update to authenticated using(private.has_permission('programmes.manage')) with check(private.has_permission('programmes.manage'));

create policy programme_circulars_admin_select on public.programme_circulars for select to authenticated using(private.has_permission('programmes.view'));
create policy programme_circulars_admin_insert on public.programme_circulars for insert to authenticated with check(private.has_permission('programmes.manage'));
create policy programme_circulars_admin_update on public.programme_circulars for update to authenticated using(private.has_permission('programmes.manage')) with check(private.has_permission('programmes.manage'));

create policy tithi_programmes_admin_select on public.tithi_programmes for select to authenticated using(private.has_permission('programmes.view') or private.has_permission('events.manage'));
create policy tithi_programmes_admin_insert on public.tithi_programmes for insert to authenticated with check(private.has_permission('events.manage'));
create policy tithi_programmes_admin_update on public.tithi_programmes for update to authenticated using(private.has_permission('events.manage')) with check(private.has_permission('events.manage'));

create policy seva_categories_admin_select on public.seva_categories for select to authenticated using(private.is_active_admin());
create policy seva_categories_admin_insert on public.seva_categories for insert to authenticated with check(private.has_permission('seva.manage'));
create policy seva_categories_admin_update on public.seva_categories for update to authenticated using(private.has_permission('seva.manage')) with check(private.has_permission('seva.manage'));

create policy seva_activities_admin_select on public.seva_activities for select to authenticated using(private.is_active_admin());
create policy seva_activities_admin_insert on public.seva_activities for insert to authenticated with check(private.has_permission('seva.manage'));
create policy seva_activities_admin_update on public.seva_activities for update to authenticated using(private.has_permission('seva.manage')) with check(private.has_permission('seva.manage'));

create policy volunteer_admin_select on public.volunteer_applications for select to authenticated using(private.has_permission('volunteer.view'));
create policy volunteer_admin_update on public.volunteer_applications for update to authenticated using(private.has_permission('volunteer.review')) with check(private.has_permission('volunteer.review'));

create policy stay_requests_admin_select on public.stay_requests for select to authenticated using(private.has_permission('stays.view'));
create policy stay_requests_admin_update on public.stay_requests for update to authenticated using(private.has_permission('stays.review')) with check(private.has_permission('stays.review'));
create policy stay_guests_admin_select on public.stay_guests for select to authenticated using(private.has_permission('stays.view'));
create policy stay_meals_admin_select on public.stay_meal_requirements for select to authenticated using(private.has_permission('stays.view'));
create policy stay_meals_admin_insert on public.stay_meal_requirements for insert to authenticated with check(private.has_permission('stays.review'));
create policy stay_meals_admin_update on public.stay_meal_requirements for update to authenticated using(private.has_permission('stays.review')) with check(private.has_permission('stays.review'));

create policy room_types_admin_select on public.room_types for select to authenticated using(private.has_permission('stays.view') or private.has_permission('ashrams.manage'));
create policy room_types_admin_insert on public.room_types for insert to authenticated with check(private.has_permission('ashrams.manage'));
create policy room_types_admin_update on public.room_types for update to authenticated using(private.has_permission('ashrams.manage')) with check(private.has_permission('ashrams.manage'));
create policy rooms_admin_select on public.rooms for select to authenticated using(private.has_permission('stays.view') or private.has_permission('ashrams.manage'));
create policy rooms_admin_insert on public.rooms for insert to authenticated with check(private.has_permission('ashrams.manage'));
create policy rooms_admin_update on public.rooms for update to authenticated using(private.has_permission('ashrams.manage')) with check(private.has_permission('ashrams.manage'));
create policy room_blocks_admin_select on public.room_blocks for select to authenticated using(private.has_permission('stays.view'));
create policy room_blocks_admin_insert on public.room_blocks for insert to authenticated with check(private.has_permission('ashrams.manage'));
create policy room_blocks_admin_update on public.room_blocks for update to authenticated using(private.has_permission('ashrams.manage')) with check(private.has_permission('ashrams.manage'));
create policy room_assignments_admin_select on public.room_assignments for select to authenticated using(private.has_permission('stays.view'));
create policy room_assignments_admin_insert on public.room_assignments for insert to authenticated with check(private.has_permission('stays.assign_room'));
create policy room_assignments_admin_update on public.room_assignments for update to authenticated using(private.has_permission('stays.assign_room')) with check(private.has_permission('stays.assign_room'));

create policy booking_documents_sensitive_select on public.booking_documents for select to authenticated using(private.has_permission('sensitive_docs.view'));
create policy booking_documents_sensitive_insert on public.booking_documents for insert to authenticated with check(private.has_permission('sensitive_docs.view'));
create policy booking_documents_sensitive_update on public.booking_documents for update to authenticated using(private.has_permission('sensitive_docs.view')) with check(private.has_permission('sensitive_docs.view'));
