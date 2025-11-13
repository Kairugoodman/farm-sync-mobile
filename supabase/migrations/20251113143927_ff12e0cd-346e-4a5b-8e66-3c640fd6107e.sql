-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile automatically
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add user_id to cows table
alter table public.cows add column user_id uuid references public.profiles(id) on delete cascade;

-- Update existing cows to have a null user_id (will need manual assignment or deletion)
-- For new cows, user_id will be required

-- Drop existing RLS policies on cows
drop policy if exists "Allow public delete access to cows" on public.cows;
drop policy if exists "Allow public insert access to cows" on public.cows;
drop policy if exists "Allow public read access to cows" on public.cows;
drop policy if exists "Allow public update access to cows" on public.cows;

-- Create new RLS policies for cows (user-specific)
create policy "Users can view their own cows"
  on public.cows for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cows"
  on public.cows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cows"
  on public.cows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cows"
  on public.cows for delete
  using (auth.uid() = user_id);

-- Drop existing RLS policies on cow_events
drop policy if exists "Allow public delete access to cow_events" on public.cow_events;
drop policy if exists "Allow public insert access to cow_events" on public.cow_events;
drop policy if exists "Allow public read access to cow_events" on public.cow_events;
drop policy if exists "Allow public update access to cow_events" on public.cow_events;

-- Create new RLS policies for cow_events (filter through cow ownership)
create policy "Users can view events for their own cows"
  on public.cow_events for select
  using (exists (
    select 1 from public.cows
    where cows.id = cow_events.cow_id
    and cows.user_id = auth.uid()
  ));

create policy "Users can insert events for their own cows"
  on public.cow_events for insert
  with check (exists (
    select 1 from public.cows
    where cows.id = cow_events.cow_id
    and cows.user_id = auth.uid()
  ));

create policy "Users can update events for their own cows"
  on public.cow_events for update
  using (exists (
    select 1 from public.cows
    where cows.id = cow_events.cow_id
    and cows.user_id = auth.uid()
  ));

create policy "Users can delete events for their own cows"
  on public.cow_events for delete
  using (exists (
    select 1 from public.cows
    where cows.id = cow_events.cow_id
    and cows.user_id = auth.uid()
  ));