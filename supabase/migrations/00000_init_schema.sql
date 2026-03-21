-- 1. Profiles Table (Link to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Trips Table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trip Members Table
CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- 4. Todos Table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  assigned_to UUID REFERENCES auth.users(id),
  external_link TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Itinerary Nodes Table
CREATE TABLE itinerary_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  day_number INT NOT NULL DEFAULT 1,
  time TEXT,
  location_name TEXT NOT NULL,
  note TEXT,
  external_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_nodes ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for trips
CREATE POLICY "Users can view trips they are members of" ON trips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = trips.id AND trip_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policies for trip_members
CREATE POLICY "Members can view other members of the same trip" ON trip_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members AS tm
      WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid()
    )
  );

-- Policies for todos
CREATE POLICY "Members can view todos of their trips" ON todos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = todos.trip_id AND trip_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert/update todos" ON todos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = todos.trip_id AND trip_members.user_id = auth.uid() AND trip_members.role IN ('admin', 'editor')
    )
  );

-- Policies for itinerary_nodes
CREATE POLICY "Members can view nodes of their trips" ON itinerary_nodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = itinerary_nodes.trip_id AND trip_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert/update nodes" ON itinerary_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = itinerary_nodes.trip_id AND trip_members.user_id = auth.uid() AND trip_members.role IN ('admin', 'editor')
    )
  );

-- Grant Access
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
