-- KK-SK Portal: run this whole file once in Supabase > SQL Editor. It is safe to run again.

create table if not exists members (
  id uuid primary key references auth.users on delete cascade,
  email text, name text, role text not null default 'kab',
  pos text, contact text, purok text, bio text, avatar text
);
alter table members add column if not exists status text not null default 'active';  -- active | pending | rejected
alter table members add column if not exists req text;                                -- 'sk' when someone asked for council access
create table if not exists items (
  id text primary key, coll text not null,
  data jsonb not null default '{}', created_at timestamptz default now()
);
alter table members enable row level security;
alter table items enable row level security;

-- Roles: kab = kabataan, sk = council, chair = SK Chairperson (super admin)
create or replace function my_role() returns text language sql security definer stable as
$$ select role from members where id = auth.uid() $$;
create or replace function my_status() returns text language sql security definer stable as
$$ select status from members where id = auth.uid() $$;
create or replace function is_active() returns boolean language sql security definer stable as
$$ select coalesce(my_status() = 'active', false) $$;
create or replace function is_sk() returns boolean language sql security definer stable as
$$ select coalesce(my_status() = 'active' and my_role() in ('sk','chair'), false) $$;
create or replace function is_chair() returns boolean language sql security definer stable as
$$ select coalesce(my_status() = 'active' and my_role() = 'chair', false) $$;

drop policy if exists m_read on members; drop policy if exists m_ins on members; drop policy if exists m_upd on members;
-- Members: see active members, yourself, and (chair only) pending requests.
create policy m_read on members for select to authenticated using (status = 'active' or id = auth.uid() or is_chair());
-- Anyone can create their own row, but only as kabataan, and only as active or pending.
create policy m_ins on members for insert to authenticated with check (id = auth.uid() and role = 'kab' and status in ('active','pending'));
-- You can edit your own profile but never your own role or status. Only the chair can approve, reject or change roles.
create policy m_upd on members for update to authenticated
  using (id = auth.uid() or is_chair())
  with check (is_chair() or (id = auth.uid() and role = my_role() and status = my_status()));

drop policy if exists i_read on items; drop policy if exists i_ins on items; drop policy if exists i_upd on items; drop policy if exists i_del on items;
-- Only active (approved) accounts can use the portal data at all.
create policy i_read on items for select to authenticated using (
  is_active()
  and (coll <> 'reports' or is_sk() or data->>'uid' = auth.uid()::text)
  and (coll <> 'chat' or data->>'room' <> 'SK Council' or is_sk())
);
create policy i_ins on items for insert to authenticated with check (
  is_active() and (is_sk() or coll in ('forum','reports','chat','profiles')
  or (coll = 'kabataan' and data->>'uid' = auth.uid()::text))
);
create policy i_upd on items for update to authenticated
  using (is_active() and (is_sk() or coll in ('forum','chat') or data->>'uid' = auth.uid()::text))
  with check (is_active() and (is_sk() or coll in ('forum','chat') or data->>'uid' = auth.uid()::text));
create policy i_del on items for delete to authenticated
  using (is_active() and (is_sk() or data->>'uid' = auth.uid()::text));

-- STEP 2 (once): sign up on your site with your own email, then make yourself the SK Chairperson:
-- update members set role = 'chair', pos = 'SK Chairperson', status = 'active' where email = 'you@example.com';
-- After that, council members sign up choosing "SK council member" and you approve them on the Approvals page.
