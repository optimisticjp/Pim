-- Final Turnstile activation boundary.
-- Public form submissions must enter through the public-form-submit Edge Function,
-- which validates Cloudflare Turnstile, payload shape, hostname, and rate limits.
-- The Edge Function uses service_role for the controlled RPC call.

revoke execute on function public.submit_membership_application(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_donation_intent(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_stay_request(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_volunteer_application(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_veda_subscription(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_veda_change_request(jsonb) from public, anon, authenticated;
revoke execute on function public.submit_veda_article(jsonb) from public, anon, authenticated;

grant execute on function public.submit_membership_application(jsonb) to service_role;
grant execute on function public.submit_donation_intent(jsonb) to service_role;
grant execute on function public.submit_stay_request(jsonb) to service_role;
grant execute on function public.submit_volunteer_application(jsonb) to service_role;
grant execute on function public.submit_veda_subscription(jsonb) to service_role;
grant execute on function public.submit_veda_change_request(jsonb) to service_role;
grant execute on function public.submit_veda_article(jsonb) to service_role;
