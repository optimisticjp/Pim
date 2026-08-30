revoke all on table public.ashram_profiles,public.programme_centres,public.programme_circulars,public.tithi_programmes,public.seva_categories,public.seva_activities,public.volunteer_applications,public.stay_requests,public.stay_guests,public.stay_meal_requirements,public.room_types,public.rooms,public.room_blocks,public.room_assignments,public.booking_documents from anon;

revoke all on table public.ashram_profiles,public.programme_centres,public.programme_circulars,public.tithi_programmes,public.seva_categories,public.seva_activities,public.volunteer_applications,public.stay_requests,public.stay_guests,public.stay_meal_requirements,public.room_types,public.rooms,public.room_blocks,public.room_assignments,public.booking_documents from authenticated;
grant select,insert,update,delete on public.ashram_profiles,public.programme_centres,public.programme_circulars,public.tithi_programmes,public.seva_categories,public.seva_activities,public.room_types,public.rooms,public.room_blocks,public.room_assignments to authenticated;
grant select,update,delete on public.volunteer_applications,public.stay_requests to authenticated;
grant select,delete on public.stay_guests to authenticated;
grant select,insert,update,delete on public.stay_meal_requirements to authenticated;
grant select,insert,update,delete on public.booking_documents to authenticated;

revoke all on function public.submit_volunteer_application(jsonb) from public;
revoke all on function public.submit_stay_request(jsonb) from public;
revoke all on function public.assign_stay_room(uuid,uuid) from public;
revoke all on function public.release_stay_room(uuid) from public;
grant execute on function public.submit_volunteer_application(jsonb) to anon,authenticated;
grant execute on function public.submit_stay_request(jsonb) to anon,authenticated;
grant execute on function public.assign_stay_room(uuid,uuid) to authenticated;
grant execute on function public.release_stay_room(uuid) to authenticated;

revoke all on function private.operations_inbox_insert() from public,anon,authenticated;
revoke all on function private.operations_inbox_status() from public,anon,authenticated;
revoke all on function private.next_stay_request_number() from public,anon;
revoke all on function private.next_volunteer_application_number() from public,anon;

create trigger audit_ashram_profiles after insert or update or delete on public.ashram_profiles for each row execute function public.audit_admin_row_change();
create trigger audit_programme_centres after insert or update or delete on public.programme_centres for each row execute function public.audit_admin_row_change();
create trigger audit_programme_circulars after insert or update or delete on public.programme_circulars for each row execute function public.audit_admin_row_change();
create trigger audit_tithi_programmes after insert or update or delete on public.tithi_programmes for each row execute function public.audit_admin_row_change();
create trigger audit_seva_categories after insert or update or delete on public.seva_categories for each row execute function public.audit_admin_row_change();
create trigger audit_seva_activities after insert or update or delete on public.seva_activities for each row execute function public.audit_admin_row_change();
create trigger audit_volunteer_applications after insert or update or delete on public.volunteer_applications for each row execute function public.audit_admin_row_change();
create trigger audit_stay_requests after insert or update or delete on public.stay_requests for each row execute function public.audit_admin_row_change();
create trigger audit_room_types after insert or update or delete on public.room_types for each row execute function public.audit_admin_row_change();
create trigger audit_rooms after insert or update or delete on public.rooms for each row execute function public.audit_admin_row_change();
create trigger audit_room_assignments after insert or update or delete on public.room_assignments for each row execute function public.audit_admin_row_change();
