-- Benha Survey - Supabase production schema and RLS
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  answers jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  timestamp timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id bigserial primary key,
  event_type text not null,
  user_id uuid references auth.users(id) on delete set null,
  event_data jsonb not null default '{}'::jsonb,
  page_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;
create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = uid
      and ap.role = 'admin'
      and ap.is_active = true
  );
$$;

revoke execute on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.surveys enable row level security;
alter table public.app_settings enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.analytics_events enable row level security;

drop policy if exists surveys_public_insert on public.surveys;
create policy surveys_public_insert
on public.surveys
for insert
to anon, authenticated
with check (true);

drop policy if exists surveys_admin_select on public.surveys;
create policy surveys_admin_select
on public.surveys
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists surveys_admin_delete on public.surveys;
create policy surveys_admin_delete
on public.surveys
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists app_settings_public_read on public.app_settings;
create policy app_settings_public_read
on public.app_settings
for select
to anon, authenticated
using (true);

drop policy if exists app_settings_admin_insert on public.app_settings;
create policy app_settings_admin_insert
on public.app_settings
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists app_settings_admin_update on public.app_settings;
create policy app_settings_admin_update
on public.app_settings
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists admin_profiles_admin_select_all on public.admin_profiles;
create policy admin_profiles_admin_select_all
on public.admin_profiles
for select
to authenticated
using (public.is_admin(auth.uid()) or auth.uid() = id);

drop policy if exists admin_profiles_admin_insert on public.admin_profiles;
create policy admin_profiles_admin_insert
on public.admin_profiles
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists admin_profiles_admin_update on public.admin_profiles;
create policy admin_profiles_admin_update
on public.admin_profiles
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists analytics_events_public_insert on public.analytics_events;
create policy analytics_events_public_insert
on public.analytics_events
for insert
to anon, authenticated
with check (true);

drop policy if exists analytics_events_admin_select on public.analytics_events;
create policy analytics_events_admin_select
on public.analytics_events
for select
to authenticated
using (public.is_admin(auth.uid()));

insert into public.app_settings (key, value)
values
  ('general', '{"title":"بنها بتقول إيه؟","subtitle":"شاركنا رأيك وساعدنا نفهم المدينة أكتر"}'::jsonb),
  ('survey_state', '{"open":true,"closedMessage":"الاستبيان مغلق حالياً"}'::jsonb)
on conflict (key) do update
set value = excluded.value;

-- Bootstrap first admin profile after creating auth user from Supabase Auth dashboard:
-- replace YOUR_ADMIN_EMAIL with your real email
-- insert into public.admin_profiles (id, email, role, is_active)
-- select id, email, 'admin', true
-- from auth.users
-- where email = 'YOUR_ADMIN_EMAIL'
-- on conflict (id) do update
-- set email = excluded.email, role = 'admin', is_active = true;
