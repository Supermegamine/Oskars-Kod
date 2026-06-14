-- Family Holiday Planner: holidays table
create table if not exists holidays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date not null,
  end_date date not null,
  added_by text not null,
  created_at timestamptz not null default now()
);

-- Enable row level security
alter table holidays enable row level security;

-- No login: allow anyone with the anon key to read/write.
drop policy if exists "Allow anon read" on holidays;
create policy "Allow anon read" on holidays
  for select using (true);

drop policy if exists "Allow anon insert" on holidays;
create policy "Allow anon insert" on holidays
  for insert with check (true);

drop policy if exists "Allow anon update" on holidays;
create policy "Allow anon update" on holidays
  for update using (true);

drop policy if exists "Allow anon delete" on holidays;
create policy "Allow anon delete" on holidays
  for delete using (true);

-- Family Holiday Planner: activities table
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  activity_date date,
  activity_time time,
  location text,
  added_by text not null,
  created_at timestamptz not null default now()
);

-- Enable row level security
alter table activities enable row level security;

-- No login: allow anyone with the anon key to read/write.
-- This is a deliberate tradeoff of the no-login shared-link approach -
-- do not put sensitive data in this table.
drop policy if exists "Allow anon read" on activities;
create policy "Allow anon read" on activities
  for select using (true);

drop policy if exists "Allow anon insert" on activities;
create policy "Allow anon insert" on activities
  for insert with check (true);

drop policy if exists "Allow anon update" on activities;
create policy "Allow anon update" on activities
  for update using (true);

drop policy if exists "Allow anon delete" on activities;
create policy "Allow anon delete" on activities
  for delete using (true);

-- Link activities to a holiday
alter table activities add column if not exists holiday_id uuid references holidays(id) on delete cascade;
create index if not exists activities_holiday_id_idx on activities(holiday_id);
