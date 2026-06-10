import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Rater = "sal" | "ali";

export type DateIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  used: boolean;
  created_at: string;
};

export type DateEntry = {
  id: string;
  idea_id: string | null;
  title: string;
  description: string;
  scheduled_for: string | null;
  status: "upcoming" | "completed";
  created_at: string;
};

export type Rating = {
  id: string;
  date_id: string;
  rater: Rater;
  rating: number;
  comment: string | null;
  created_at: string;
};
