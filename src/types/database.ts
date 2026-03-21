export interface Profile {
  name: string | null;
  avatar_url: string | null;
}

export interface Trip {
  id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  cover_image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TripMember {
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  profiles: Profile | Profile[] | null;
}

export interface Todo {
  id: string;
  trip_id: string;
  title: string;
  is_public: boolean;
  assigned_to: string | null;
  external_link: string | null;
  is_completed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignee_profile?: Profile | null;
}

export interface ItineraryNode {
  id: string;
  trip_id: string;
  day_number: number;
  time_text: string | null;
  location_name: string;
  note: string | null;
  external_link: string | null;
  created_at: string;
}
