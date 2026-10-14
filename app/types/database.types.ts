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
          /** 歷來最長連續天數（不是目前連續天數，目前的是 current_streak） */
          consecutive_days: number
          total_time_minutes: number
          total_xp: number
          total_sessions: number
          current_level: number
          current_streak: number
          achievements: Record<string, string>
          last_played_date: string
          updated_at: string
          /** 能力難度（1–100）；還沒同步過為 null，用戶端改以 XP 等級當起點 */
          difficulty_level: number | null
          /** difficulty_level 的設定時間，多裝置之間以較新的為準 */
          difficulty_updated_at: string | null
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
          difficulty_level?: number | null
          difficulty_updated_at?: string | null
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
          difficulty_level?: number | null
          difficulty_updated_at?: string | null
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
          p_difficulty_level?: number | null
          p_difficulty_updated_at?: string | null
        }
        Returns: Database['public']['Tables']['game_stats']['Row']
      }
      /** 刪除呼叫者自己的帳號與遊戲資料（R05） */
      delete_my_account: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
