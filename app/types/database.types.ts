export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      game_sessions: {
        Row: {
          id: string
          user_id: string
          score: number
          accuracy: number
          correct_count: number
          incorrect_count: number
          avg_response_time: number
          total_time_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          accuracy: number
          correct_count: number
          incorrect_count: number
          avg_response_time: number
          total_time_ms: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          accuracy?: number
          correct_count?: number
          incorrect_count?: number
          avg_response_time?: number
          total_time_ms?: number
          created_at?: string
        }
        Relationships: []
      }
      game_stats: {
        Row: {
          user_id: string
          high_score: number
          consecutive_days: number
          total_time_minutes: number
          total_xp: number
          total_sessions: number
          current_level: number
          current_streak: number
          achievements: Record<string, string>
          last_played_date: string
          updated_at: string
        }
        Insert: {
          user_id: string
          high_score?: number
          consecutive_days?: number
          total_time_minutes?: number
          total_xp?: number
          total_sessions?: number
          current_level?: number
          current_streak?: number
          achievements?: Record<string, string>
          last_played_date?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          high_score?: number
          consecutive_days?: number
          total_time_minutes?: number
          total_xp?: number
          total_sessions?: number
          current_level?: number
          current_streak?: number
          achievements?: Record<string, string>
          last_played_date?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_stats: {
        Args: {
          p_xp?: number
          p_minutes?: number
          p_sessions?: number
          p_high_score?: number
          p_longest_streak?: number
          p_current_streak?: number
          p_last_played_date?: string
          p_achievements?: Record<string, string>
        }
        Returns: Database['public']['Tables']['game_stats']['Row']
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
