-- Execute in the Supabase SQL editor after this account signs in with Google.
-- This script is not exposed as a website endpoint.
insert into public.administradores(user_id)
select u.id from auth.users u
where lower(u.email) = 'ivanmrts369@gmail.com'
  and u.email_confirmed_at is not null
  and exists(select 1 from auth.identities i where i.user_id = u.id and i.provider = 'google')
on conflict (user_id) do nothing;

select u.email from public.administradores a join auth.users u on u.id = a.user_id;
