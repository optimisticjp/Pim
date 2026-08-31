alter table public.media_folders disable trigger media_folders_publish_guard;
alter table public.media_assets disable trigger media_assets_publish_guard;

with parent as (select id from public.media_folders where slug='katha')
insert into public.media_folders(parent_id,slug,title_gu,category,description_gu,sort_order,published)
select parent.id,v.slug,v.title,'youtube',v.description,v.ord,true from parent cross join (values
(10,'katha-with-swami','સ્વામી શ્રી સાથે','Legacy collection: With Swami Shree'),
(20,'katha-jagdishanand-2011','શ્રી જગદીશાનંદ સાગરજી મહારાજ — વિદેશ યાત્રા ૨૦૧૧','Historical pravachan collection'),
(30,'katha-akhandanand-tithi-2011','શ્રી અખંડાનંદ સાગરજી મહારાજની તિથિ — સુરત ૨૦૧૧','Historical Nirvan Jayanti collection'),
(40,'katha-bhagwat-pipaliya-2010','શ્રીમદ્ ભાગવત સપ્તાહ જ્ઞાનયજ્ઞ — પીપળીયા, એપ્રિલ ૨૦૧૦','Historical Bhagwat Saptah collection')
) v(ord,slug,title,description)
on conflict(slug) do update set parent_id=excluded.parent_id,title_gu=excluded.title_gu,description_gu=excluded.description_gu,sort_order=excluded.sort_order,published=true,archived_at=null;

with f as (select id,slug from public.media_folders where slug in ('katha-with-swami','katha-jagdishanand-2011','katha-akhandanand-tithi-2011','katha-bhagwat-pipaliya-2010'))
insert into public.media_assets(folder_id,title_gu,media_type,asset_url,source_url,source_label,sort_order,published)
select f.id,v.title||case when v.context<>'' then ' — '||v.context else '' end,'youtube','https://www.youtube.com/watch?v='||v.youtube_id,v.source_url,v.context,v.ord,true
from f join (values
('katha-with-swami',1,'Lh58SWisZLo','Swami Shree Akhandanand Sagarji Maharaj''s Pravachan','Nirvan Jayanti Mahotsav (Bhambhan)','https://omshreemadhavanandji.org/video_list.php?vgid=1'),
('katha-with-swami',2,'ZdxeFdUs-AI','Shree Jagdishanand Sagarji Maharaj, Shree Prakashanand Sagarji Maharaj','Guru Punjan (Chanod 2000)','https://omshreemadhavanandji.org/video_list.php?vgid=1'),
('katha-with-swami',3,'bnOYu1wF6OA','Swami Shree Akhandanand Sagarji Maharaj','Morning Prayer (Path) (Surat 1996)','https://omshreemadhavanandji.org/video_list.php?vgid=1'),
('katha-jagdishanand-2011',4,'M6TYxcuVTg0','Shree Jagdishanand Sagarji Maharaj','Guru Purnima (Chicago, USA 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-jagdishanand-2011',5,'h44t0CvyyBs','Shree Jagdishanand Sagarji Maharaj','Swamiji Pravachan 1 (Chicago, USA 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-jagdishanand-2011',6,'2dGIPnyx-lI','Shree Jagdishanand Sagarji Maharaj','Swamiji Pravachan 2 (Chicago, USA 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-jagdishanand-2011',7,'B90wmjH2MKA','Shree Jagdishanand Sagarji Maharaj','Swamiji Pravachan 2 (London, UK 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-jagdishanand-2011',8,'sIkgJMNiGq8','Shree Jagdishanand Sagarji Maharaj','Swamiji Pravachan 3 (London, UK 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-jagdishanand-2011',9,'eEHrDrBUVXc','Shree Jagdishanand Sagarji Maharaj','Swamiji Pravachan 1 (London, UK 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=2'),
('katha-akhandanand-tithi-2011',10,'ZqS2HlpGhdE','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 1 - Shobha Yatra (12 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',11,'ZEr_BeB4Urk','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 2 - Shobha Yatra (12 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',12,'oZZQbd8puPI','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 3 - Shobha Yatra (12 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',13,'b6odMtcgpJA','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 4 - Swamiji Pravachan (12 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',14,'s5fqh3_UEmA','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 5 - Guru Punjan (13 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',15,'BScrq_xwVR0','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 6 - Swamiji Pravachan (13 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-akhandanand-tithi-2011',16,'EZyrBIdYrzs','Swami Shree Akhandanand Sagarji Maharj''s 11th Nirvan Jayanti Mahotsav','Part 7 - Swamiji Pravachan (13 May, 2011)','https://omshreemadhavanandji.org/video_list.php?vgid=3'),
('katha-bhagwat-pipaliya-2010',17,'HPobTEd3v4A','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Pothi Yatra','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',18,'qmzKm7kPV8M','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 1','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',19,'QZLcwWkQW-M','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 2','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',20,'SOYYOYLHBVs','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 3','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',21,'vMPjFsfWCTY','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 4','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',22,'yRGqurClxKM','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 5','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',23,'IfR2rXVU2Do','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 6','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',24,'1iAEOMhY4yw','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 8','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',25,'zuvaP_QPozI','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 9','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',26,'IFDjSEb4DZk','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 10','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',27,'8ZwOMWEe57c','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 12','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',28,'lxHh4-dvj88','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 13','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',29,'ovE61Yky5Ug','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 15','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',30,'BGNZeC0Ksso','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 16','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',31,'pxuJcWoEEtk','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 17','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',32,'w0ob9LldFkE','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 18','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',33,'qxDqbxtMjUI','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 19','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',34,'V5oo889qhZ8','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 20','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',35,'3V0sk5dWrt0','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 21','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',36,'b7QHjZs2dl0','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 22','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',37,'NZfUTLCiT4w','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 23','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',38,'AV8ONoWc5Cc','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 24','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',39,'7pPEYvKtIK4','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 25','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',40,'GSkBQwG-3Xo','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 26','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',41,'UPH3tG9KNok','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 27','https://omshreemadhavanandji.org/video_list.php?vgid=4'),
('katha-bhagwat-pipaliya-2010',42,'kxt7ZTQKg2Q','Shreemad Bhagwat Saptah Gyan Yagna Pipaliya (Gujarat, India)','Part 31','https://omshreemadhavanandji.org/video_list.php?vgid=4')
) v(folder_slug,ord,youtube_id,title,context,source_url) on f.slug=v.folder_slug
where not exists(select 1 from public.media_assets a where a.asset_url='https://www.youtube.com/watch?v='||v.youtube_id);

alter table public.media_assets enable trigger media_assets_publish_guard;
alter table public.media_folders enable trigger media_folders_publish_guard;