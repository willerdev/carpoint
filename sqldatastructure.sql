-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create RLS policies
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Sample data for cars table
create table cars (
  id uuid default uuid_generate_v4() primary key,
  make text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  mileage integer not null,
  fuel_type text not null,
  transmission text not null,
  body_type text not null,
  color text not null,
  image_url text not null,
  features text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample cars
insert into cars (make, model, year, price, mileage, fuel_type, transmission, body_type, color, image_url, features)
values
  ('BMW', 'M4', 2023, 85000, 1500, 'Petrol', 'Automatic', 'Coupe', 'Black', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop', ARRAY['Navigation', 'Leather Seats', 'Sunroof']),
  ('Mercedes-Benz', 'C300', 2022, 65000, 5000, 'Petrol', 'Automatic', 'Sedan', 'Silver', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop', ARRAY['Bluetooth', 'Heated Seats', 'Parking Sensors']),
  ('Audi', 'e-tron GT', 2023, 120000, 1000, 'Electric', 'Automatic', 'Sedan', 'Gray', 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2070&auto=format&fit=crop', ARRAY['360 Camera', 'Air Suspension', 'Matrix LED']);

-- Enable RLS for cars table
alter table cars enable row level security;

create policy "Cars are viewable by everyone."
  on cars for select
  using ( true );

create policy "Only authenticated users can insert cars."
  on cars for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update cars."
  on cars for update
  using ( auth.role() = 'authenticated' );

-- Create user_cars table to track car ownership
create table user_cars (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  car_id uuid references cars on delete cascade not null,
  is_owner boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, car_id)
);

-- Enable RLS for user_cars table
alter table user_cars enable row level security;

-- Create policies for user_cars
create policy "Users can view their own car associations"
  on user_cars for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own car associations"
  on user_cars for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own car associations"
  on user_cars for delete
  using ( auth.uid() = user_id );

-- Update cars table policies to allow management
create policy "Users can update their own cars"
  on cars for update using (
    exists (
      select 1 from user_cars
      where user_cars.car_id = id
      and user_cars.user_id = auth.uid()
      and user_cars.is_owner = true
    )
  );

create policy "Users can delete their own cars"
  on cars for delete using (
    exists (
      select 1 from user_cars
      where user_cars.car_id = id
      and user_cars.user_id = auth.uid()
      and user_cars.is_owner = true
    )
  );
