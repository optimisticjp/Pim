insert into public.ashram_profiles(slug,name_gu,city_gu,state_gu,full_address,office_phone,accepts_stays,published,verified)
values
('surat','શ્રી માધવાનંદ આશ્રમ — સુરત','સુરત','ગુજરાત','ઉદયનગર-૧, કતારગામ રોડ, સુરત, ગુજરાત — ૩૯૫૦૦૪','+91 261 2534610',true,true,true),
('chanod','શ્રી માધવાનંદ આશ્રમ — ચાણોદ','ચાણોદ','ગુજરાત','દયારામપુરી, ચાણોદ, તા. ડભોઇ, જી. વડોદરા, ગુજરાત — ૩૯૧૧૦૫','+91 2663 233362',true,true,true),
('sughad','આંતરરાષ્ટ્રીય શ્રી માધવાનંદ આશ્રમ — સુઘડ','સુઘડ / ગાંધીનગર','ગુજરાત','ઇન્દિરા બ્રિજ, નર્મદા મુખ્ય કેનાલ નજીક, કોબા સર્કલ, સુઘડ, ગાંધીનગર — ૩૮૨૪૨૪','+91 79 23276151',true,true,true),
('bhavnagar','શ્રી માધવાનંદ આશ્રમ — ભાવનગર','ભાવનગર','ગુજરાત','૧૦૮૫ પટેલ પાર્ક, ન્યૂ એરોડ્રમ રોડ, ભાવનગર, ગુજરાત — ૩૬૪૦૦૧','+91 278 2201399',false,true,true),
('akru','શ્રી માધવાનંદ આશ્રમ — આકરુ','આકરુ','ગુજરાત','આકરુ, તા. ધંધુકા, જી. અમદાવાદ, ગુજરાત','+91 2713 232633',false,true,true),
('haridwar','શ્રી માધવાનંદ આશ્રમ — હરિદ્વાર','હરિદ્વાર','ઉત્તરાખંડ','દક્ષેશ્વર રોડ, જગજીતપુર, કનખલ, હરિદ્વાર, ઉત્તરાખંડ — ૨૪૯૪૦૮','+91 1334 246675',true,true,true),
('prayagraj','શ્રી માધવાનંદ આશ્રમ — પ્રયાગરાજ','પ્રયાગરાજ','ઉત્તર પ્રદેશ',null,null,true,true,false),
('ujjain','શ્રી માધવાનંદ આશ્રમ — ઉજ્જૈન','ઉજ્જૈન','મધ્ય પ્રદેશ',null,null,true,true,false)
on conflict(slug) do update set name_gu=excluded.name_gu,city_gu=excluded.city_gu,state_gu=excluded.state_gu,full_address=excluded.full_address,office_phone=excluded.office_phone,accepts_stays=excluded.accepts_stays,published=excluded.published,verified=excluded.verified;

insert into public.seva_categories(slug,title_gu,description_gu,published,sort_order)
values
('medical-camp','સર્વ રોગ નિદાન કેમ્પ','આરોગ્ય નિદાન અને સેવા કેમ્પ',true,10),
('dispensary','દવાખાનું','માનવ સેવા એ જ માધવ સેવા',true,20),
('blood-donation','રક્તદાન કેમ્પ','રક્તદાન અને જીવનરક્ષા સેવા',true,30),
('gaushala','ગૌ શાળા','ગૌ સેવા એ જ પ્રભુ સેવા',true,40),
('annakshetra','અન્નક્ષેત્ર','પ્રસાદ અને અન્ન સેવા',true,50),
('tree-plantation','વૃક્ષારોપણ','પર્યાવરણ અને વૃક્ષ સેવા',true,60),
('bird-feeding','પક્ષીઓને ચણ','જીવદયા અને પક્ષી સેવા',true,70),
('gurukul','ગુરુકુળ','વેદિક અભ્યાસ અને સંસ્કાર સેવા',true,80)
on conflict(slug) do update set title_gu=excluded.title_gu,description_gu=excluded.description_gu,published=excluded.published,sort_order=excluded.sort_order;
