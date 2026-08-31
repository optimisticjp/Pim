alter table public.media_assets disable trigger media_assets_publish_guard;

with folder as (select id from public.media_folders where slug='audio-bhajan')
insert into public.media_assets(folder_id,title_gu,media_type,asset_url,mime_type,source_url,source_label,sort_order,published)
select folder.id,v.title,'audio',v.url,'audio/mpeg','https://omshreemadhavanandji.org/download_mringtone.php','Legacy official devotional audio archive',v.ord,true
from folder cross join (values
(101,'Aakru Jajo Darshan Jajo','https://omshreemadhavanandji.org/content/down_mobring/Aakru-Jajo-Darshan-Jajo.mp3'),
(102,'Alakh Niranjan Jay Sachchidanand','https://omshreemadhavanandji.org/content/down_mobring/Alakh-Niranjan-Jay-Sachchidanand.mp3'),
(103,'Amara Dukhada Ne Talo','https://omshreemadhavanandji.org/content/down_mobring/Amara-Dukhada-Ne-Talo.mp3'),
(104,'Bhave Bhaji Le Kailash Pati','https://omshreemadhavanandji.org/content/down_mobring/Bhave-Bhaji-Le-Kailash-Pati.mp3'),
(105,'Bol Sachchidanand Bol Madhavanand','https://omshreemadhavanandji.org/content/down_mobring/Bol-Sachchidanand-Bol-Madhavanand.mp3'),
(106,'Chinta Rahit Jivo','https://omshreemadhavanandji.org/content/down_mobring/Chinta-Rahit-Jivo.mp3'),
(107,'Dejo Darshan Tame','https://omshreemadhavanandji.org/content/down_mobring/Dejo-Darshan-Tame.mp3'),
(108,'Gametevo Gano Mujane Guruji','https://omshreemadhavanandji.org/content/down_mobring/Gametevo-Gano-Mujane-Guruji.mp3'),
(109,'Guru Malya Gunkari Re','https://omshreemadhavanandji.org/content/down_mobring/Guru-Malya-Gunkari-Re.mp3'),
(110,'Guru Tame Chho Ame Tamara','https://omshreemadhavanandji.org/content/down_mobring/Guru-Tame-Chho-Ame-Tamara.mp3'),
(111,'Halo Halo Darshan Karva Swamijina','https://omshreemadhavanandji.org/content/down_mobring/Halo-Halo-Darshan-Karva-Swamijina.mp3'),
(112,'Hoji Re Swami Jug Jugna','https://omshreemadhavanandji.org/content/down_mobring/Hoji-Re-Swami-Jug-Jugna.mp3'),
(113,'Jago Have Udhdhar Potano','https://omshreemadhavanandji.org/content/down_mobring/Jago-Have-Udhdhar-Potano.mp3'),
(115,'Madhav Anand Anand','https://omshreemadhavanandji.org/content/down_mobring/Madhav-Anand-Anand.mp3'),
(116,'Man To Maya No Chhe','https://omshreemadhavanandji.org/content/down_mobring/Man-To-Maya-No-Chhe.mp3'),
(117,'Parodha Na Prabhatiya','https://omshreemadhavanandji.org/content/down_mobring/Parodha-Na-Prabhatiya.mp3'),
(118,'Sahaj Samadhi Lagi Re','https://omshreemadhavanandji.org/content/down_mobring/Sahaj-Samadhi-Lagi-Re.mp3'),
(119,'Sane Chinta Kare Chhe','https://omshreemadhavanandji.org/content/down_mobring/Sane-Chinta-Kare-Chhe.mp3'),
(120,'Tara Ghat Ma Govind Bole','https://omshreemadhavanandji.org/content/down_mobring/Tara-Ghat-Ma-Govind-Bole.mp3'),
(121,'Tuto Samaran Kar Sachchidanand Nu','https://omshreemadhavanandji.org/content/down_mobring/Tuto-Samaran-Kar-Sachchidanand-Nu.mp3')
) v(ord,title,url) where not exists(select 1 from public.media_assets a where a.asset_url=v.url);

with folder as (select id from public.media_folders where slug='audio-aarti')
insert into public.media_assets(folder_id,title_gu,media_type,asset_url,mime_type,source_url,source_label,sort_order,published)
select folder.id,'Jai Sadguru Swamiji Arti','audio','https://omshreemadhavanandji.org/content/down_mobring/Jai-Sadguru-Swamiji-Arti.mp3','audio/mpeg','https://omshreemadhavanandji.org/download_mringtone.php','Legacy official devotional audio archive',10,true from folder
where not exists(select 1 from public.media_assets where asset_url='https://omshreemadhavanandji.org/content/down_mobring/Jai-Sadguru-Swamiji-Arti.mp3');

with folder as (select id from public.media_folders where slug='literature')
insert into public.media_assets(folder_id,title_gu,media_type,asset_url,mime_type,source_url,source_label,sort_order,published)
select folder.id,v.title,'pdf',v.url,'application/pdf','https://omshreemadhavanandji.org/publication_book.php','Legacy official Books & Magazines archive',v.ord,true
from folder cross join (values
(10,'Ishavasyopnishad','https://omshreemadhavanandji.org/content/pub_book/Ishavasyopnishad.pdf'),
(20,'Ishwar Swarup Varnanmala','https://omshreemadhavanandji.org/content/pub_book/Ishwar-Swarup-Varnanmala.pdf'),
(30,'Madhavanandji Jivanlila & Updesh','https://omshreemadhavanandji.org/content/pub_book/Madhavanandji-Jivanlila-Updesh.pdf'),
(40,'Shree Sadguru Mahima','https://omshreemadhavanandji.org/content/pub_book/Shree-Sadguru-Mahima.pdf'),
(50,'Shree Guru Gita Small','https://omshreemadhavanandji.org/content/pub_book/Shree-Guru-Gita-Small.pdf'),
(60,'Nirvan Smaranika','https://omshreemadhavanandji.org/content/pub_book/Nirvan-Smaranika.pdf'),
(70,'Guru Mahima','https://omshreemadhavanandji.org/content/pub_book/Guru-Mahima.pdf')
) v(ord,title,url) where not exists(select 1 from public.media_assets a where a.asset_url=v.url);

alter table public.media_assets enable trigger media_assets_publish_guard;