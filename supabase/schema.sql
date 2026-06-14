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
create policy "Allow anon read" on activities
  for select using (true);

create policy "Allow anon insert" on activities
  for insert with check (true);

create policy "Allow anon update" on activities
  for update using (true);

create policy "Allow anon delete" on activities
  for delete using (true);
