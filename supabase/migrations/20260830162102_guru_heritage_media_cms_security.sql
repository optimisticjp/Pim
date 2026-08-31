alter table public.guru_profiles enable row level security;
alter table public.guru_chapters enable row level security;
alter table public.heritage_documents enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_assets enable row level security;

create policy guru_profiles_admin_select on public.guru_profiles for select to authenticated using(private.has_permission('guru.view'));
create policy guru_profiles_admin_insert on public.guru_profiles for insert to authenticated with check(private.has_permission('guru.manage'));
create policy guru_profiles_admin_update on public.guru_profiles for update to authenticated using(private.has_permission('guru.manage')) with check(private.has_permission('guru.manage'));
create policy guru_profiles_super_delete on public.guru_profiles for delete to authenticated using(private.is_super_admin());

create policy guru_chapters_admin_select on public.guru_chapters for select to authenticated using(private.has_permission('guru.view'));
create policy guru_chapters_admin_insert on public.guru_chapters for insert to authenticated with check(private.has_permission('guru.manage'));
create policy guru_chapters_admin_update on public.guru_chapters for update to authenticated using(private.has_permission('guru.manage')) with check(private.has_permission('guru.manage'));
create policy guru_chapters_super_delete on public.guru_chapters for delete to authenticated using(private.is_super_admin());

create policy heritage_admin_select on public.heritage_documents for select to authenticated using(private.is_active_admin());
create policy heritage_admin_insert on public.heritage_documents for insert to authenticated with check(private.has_permission('heritage.manage'));
create policy heritage_admin_update on public.heritage_documents for update to authenticated using(private.has_permission('heritage.manage')) with check(private.has_permission('heritage.manage'));
create policy heritage_super_delete on public.heritage_documents for delete to authenticated using(private.is_super_admin());

create policy media_folders_admin_select on public.media_folders for select to authenticated using(private.has_permission('media.view'));
create policy media_folders_admin_insert on public.media_folders for insert to authenticated with check(private.has_permission('media.manage'));
create policy media_folders_admin_update on public.media_folders for update to authenticated using(private.has_permission('media.manage')) with check(private.has_permission('media.manage'));
create policy media_folders_super_delete on public.media_folders for delete to authenticated using(private.is_super_admin());

create policy media_assets_admin_select on public.media_assets for select to authenticated using(private.has_permission('media.view'));
create policy media_assets_admin_insert on public.media_assets for insert to authenticated with check(private.has_permission('media.manage'));
create policy media_assets_admin_update on public.media_assets for update to authenticated using(private.has_permission('media.manage')) with check(private.has_permission('media.manage'));
create policy media_assets_super_delete on public.media_assets for delete to authenticated using(private.is_super_admin());

revoke all on public.guru_profiles,public.guru_chapters,public.heritage_documents,public.media_folders,public.media_assets from anon;

create or replace function private.guard_cms_publish()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='guru_profiles' then
    if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.published=true and new.published=false and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name='guru_chapters' then
    if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') and not private.has_permission('guru.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name='heritage_documents' then
    if new.status='published' and (tg_op='INSERT' or old.status is distinct from 'published') and not private.has_permission('heritage.publish') then raise exception 'Publish permission required'; end if;
  elsif tg_table_name in ('media_folders','media_assets') then
    if new.published=true and (tg_op='INSERT' or old.published is distinct from true) and not private.has_permission('media.publish') then raise exception 'Publish permission required'; end if;
    if tg_op='UPDATE' and old.published=true and new.published=false and not private.has_permission('media.publish') then raise exception 'Publish permission required'; end if;
  end if;
  return new;
end; $$;
revoke all on function private.guard_cms_publish() from public,anon,authenticated;

create trigger guru_profiles_updated before update on public.guru_profiles for each row execute function public.set_updated_at();
create trigger guru_chapters_updated before update on public.guru_chapters for each row execute function public.set_updated_at();
create trigger heritage_documents_updated before update on public.heritage_documents for each row execute function public.set_updated_at();
create trigger media_folders_updated before update on public.media_folders for each row execute function public.set_updated_at();
create trigger media_assets_updated before update on public.media_assets for each row execute function public.set_updated_at();

create trigger guru_profiles_publish_guard before insert or update on public.guru_profiles for each row execute function private.guard_cms_publish();
create trigger guru_chapters_publish_guard before insert or update on public.guru_chapters for each row execute function private.guard_cms_publish();
create trigger heritage_documents_publish_guard before insert or update on public.heritage_documents for each row execute function private.guard_cms_publish();
create trigger media_folders_publish_guard before insert or update on public.media_folders for each row execute function private.guard_cms_publish();
create trigger media_assets_publish_guard before insert or update on public.media_assets for each row execute function private.guard_cms_publish();

create trigger audit_guru_profiles after insert or update or delete on public.guru_profiles for each row execute function public.audit_admin_row_change();
create trigger audit_guru_chapters after insert or update or delete on public.guru_chapters for each row execute function public.audit_admin_row_change();
create trigger audit_heritage_documents after insert or update or delete on public.heritage_documents for each row execute function public.audit_admin_row_change();
create trigger audit_media_folders after insert or update or delete on public.media_folders for each row execute function public.audit_admin_row_change();
create trigger audit_media_assets after insert or update or delete on public.media_assets for each row execute function public.audit_admin_row_change();

create or replace function public.list_public_guru_profiles()
returns table(id uuid,slug text,name_gu text,source_title_en text,qualification_gu text,portrait_url text,lineage_order integer,featured boolean)
language sql security definer set search_path='' as $$
 select g.id,g.slug,g.name_gu,g.source_title_en,g.qualification_gu,g.portrait_url,g.lineage_order,g.featured from public.guru_profiles g where g.published=true and g.archived_at is null order by g.lineage_order nulls last,g.created_at;
$$;
create or replace function public.list_public_guru_chapters(target_slug text)
returns table(id uuid,slug text,title_gu text,summary_gu text,body_md text,sort_order integer)
language sql security definer set search_path='' as $$
 select c.id,c.slug,c.title_gu,c.summary_gu,c.body_md,c.sort_order from public.guru_chapters c join public.guru_profiles g on g.id=c.guru_profile_id where g.slug=target_slug and g.published=true and g.archived_at is null and c.status='published' order by c.sort_order;
$$;
create or replace function public.list_public_heritage_documents()
returns table(id uuid,kind text,title_gu text,description_gu text,document_date date,date_label_gu text,file_url text,image_url text)
language sql security definer set search_path='' as $$
 select h.id,h.kind,h.title_gu,h.description_gu,h.document_date,h.date_label_gu,h.file_url,h.image_url from public.heritage_documents h where h.status='published' order by h.sort_order,h.document_date nulls last;
$$;
create or replace function public.list_public_media_folders()
returns table(id uuid,parent_id uuid,slug text,title_gu text,category text,description_gu text,sort_order integer)
language sql security definer set search_path='' as $$
 select f.id,f.parent_id,f.slug,f.title_gu,f.category,f.description_gu,f.sort_order from public.media_folders f where f.published=true and f.archived_at is null order by f.sort_order,f.title_gu;
$$;
create or replace function public.list_public_media_assets(target_folder_slug text default null)
returns table(id uuid,folder_id uuid,title_gu text,media_type text,asset_url text,thumbnail_url text,mime_type text,duration_seconds integer,sort_order integer)
language sql security definer set search_path='' as $$
 select a.id,a.folder_id,a.title_gu,a.media_type,a.asset_url,a.thumbnail_url,a.mime_type,a.duration_seconds,a.sort_order from public.media_assets a left join public.media_folders f on f.id=a.folder_id where a.published=true and a.archived_at is null and (target_folder_slug is null or f.slug=target_folder_slug) order by a.sort_order,a.title_gu;
$$;

grant execute on function public.list_public_guru_profiles() to anon,authenticated;
grant execute on function public.list_public_guru_chapters(text) to anon,authenticated;
grant execute on function public.list_public_heritage_documents() to anon,authenticated;
grant execute on function public.list_public_media_folders() to anon,authenticated;
grant execute on function public.list_public_media_assets(text) to anon,authenticated;