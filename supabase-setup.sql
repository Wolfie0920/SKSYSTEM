-- KK-SK Portal: run this once in Supabase > SQL Editor.

create table if not exists members (
  id uuid primary key references auth.users on delete cascade,
  email text, name text, role text not null default 'kab',
  pos text, contact text, purok text, bio text, avatar text
);
create table if not exists items (
  id text primary key, coll text not null,
  data jsonb not null default '{}', created_at timestamptz default now()
);
alter table members enable row level security;
alter table items enable row level security;

create or replace function is_sk() returns boolean
language sql security definer stable as
$$ select exists(select 1 from members where id = auth.uid() and role = 'sk') $$;

-- Members: every signed-in user can read; you edit only your own row; nobody can make themselves SK.
create policy m_read on members for select to authenticated using (true);
create policy m_ins  on members for insert to authenticated with check (id = auth.uid() and role = 'kab');
create policy m_upd  on members for update to authenticated
  using (id = auth.uid() or is_sk())
  with check (is_sk() or (id = auth.uid() and role = (select role from members where id = auth.uid())));

-- Items (assemblies, resolutions, projects, forum, reports, chat, profiles, kabataan list).
create policy i_read on items for select to authenticated using (
  (coll <> 'reports' or is_sk() or data->>'uid' = auth.uid()::text)
  and (coll <> 'chat' or data->>'room' <> 'SK Council' or is_sk())
);
create policy i_ins on items for insert to authenticated with check (
  is_sk() or coll in ('forum','reports','chat','profiles')
  or (coll = 'kabataan' and data->>'uid' = auth.uid()::text)
);
create policy i_upd on items for update to authenticated
  using (is_sk() or coll in ('forum','chat') or data->>'uid' = auth.uid()::text)
  with check (is_sk() or coll in ('forum','chat') or data->>'uid' = auth.uid()::text);
create policy i_del on items for delete to authenticated
  using (is_sk() or data->>'uid' = auth.uid()::text);

-- Make someone an SK council member (after they sign up):
-- update members set role = 'sk', pos = 'SK Chairperson' where email = 'name@example.com';
