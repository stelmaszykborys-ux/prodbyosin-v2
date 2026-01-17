-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Admins Table
create table if not exists admins (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Beats Table
create table if not exists beats (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  bpm integer,
  key text,
  genre text,
  mood text,
  tags text[],
  audio_preview_url text, -- Short preview
  audio_full_url text,    -- Protected full version
  cover_image_url text,
  price_mp3 integer default 0,   -- Prices in cents
  price_wav integer default 0,
  price_stems integer default 0,
  is_sold boolean default false,
  is_featured boolean default false,
  is_published boolean default true,
  plays_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Drops Table (Beat Packs)
create table if not exists drops (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  background_image_url text,
  background_color text default '#000000',
  is_active boolean default true,
  order_index integer default 0,
  release_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Drop Beats (Join Table)
create table if not exists drop_beats (
  id uuid default uuid_generate_v4() primary key,
  drop_id uuid references drops(id) on delete cascade not null,
  beat_id uuid references beats(id) on delete cascade not null,
  order_index integer default 0,
  unique(drop_id, beat_id)
);

-- 5. Orders Table
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  beat_id uuid references beats(id),
  user_id uuid references auth.users(id), -- Optional, for registered buyers
  customer_email text not null,
  customer_name text,
  license_type text not null, -- 'mp3', 'wav', 'stems'
  price_paid integer not null, -- Amount in cents
  stripe_payment_id text,
  stripe_session_id text,
  status text default 'pending', -- 'pending', 'completed', 'failed'
  download_url text,
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Site Settings (Key-Value Store for 'About', 'Contact' pages)
create table if not exists site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. FAQ Items
create table if not exists faq_items (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  answer text not null,
  category text default 'general',
  is_published boolean default true,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table admins enable row level security;
alter table beats enable row level security;
alter table drops enable row level security;
alter table orders enable row level security;
alter table site_settings enable row level security;
alter table faq_items enable row level security;

create policy "Public beats are viewable by everyone" on beats for select using (true);
create policy "Public drops are viewable by everyone" on drops for select using (true);
create policy "FAQ items are viewable by everyone" on faq_items for select using (true);
create policy "Site settings are viewable by everyone" on site_settings for select using (true);

create policy "Admins can view admins" on admins for select using (auth.uid() in (select id from admins));
create policy "Service role can manage admins" on admins using (true); 

create policy "Admins can insert beats" on beats for insert with check (auth.uid() in (select id from admins));
create policy "Admins can update beats" on beats for update using (auth.uid() in (select id from admins));
create policy "Admins can delete beats" on beats for delete using (auth.uid() in (select id from admins));

create policy "Admins can manage drops" on drops using (auth.uid() in (select id from admins));
create policy "Admins can manage drop_beats" on drop_beats using (auth.uid() in (select id from admins));
create policy "Admins can manage faq" on faq_items using (auth.uid() in (select id from admins));
create policy "Admins can manage settings" on site_settings using (auth.uid() in (select id from admins));

create policy "Users can see own orders" on orders for select using (
  auth.uid() = user_id OR customer_email = (select email from auth.users where id = auth.uid())
);
create policy "Admins can see all orders" on orders for select using (auth.uid() in (select id from admins));

insert into storage.buckets (id, name, public) values ('public', 'public', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('beats', 'beats', true) on conflict do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'public' );
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'public' AND auth.uid() in (select id from admins) );

create policy "Public Access Beats" on storage.objects for select using ( bucket_id = 'beats' );
create policy "Admin Upload Beats" on storage.objects for insert with check ( bucket_id = 'beats' AND auth.uid() in (select id from admins) );
