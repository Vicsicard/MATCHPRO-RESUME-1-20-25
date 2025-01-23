export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id'>>;
      }
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      }
    }
    Views: {
      [_ in never]: never;
    }
    Functions: {
      [_ in never]: never;
    }
    Enums: {
      [_ in never]: never;
    }
  }
}
