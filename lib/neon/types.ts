// Database types for Neon PostgreSQL
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          full_name?: string
          avatar_url?: string
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string
          avatar_url?: string
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          avatar_url?: string
          subscription_tier?: string
          subscription_status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
          is_public: boolean
          created_by?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          category: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          is_public?: boolean
          created_by?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          is_public?: boolean
          created_by?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description?: string
          created_at: string
          updated_at: string
          user_id: string
          status: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
          updated_at?: string
          user_id: string
          status?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          status?: string
        }
      }
    }
  }
}

// Auth types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  full_name?: string
  avatar_url?: string
  subscription_tier: string
  subscription_status: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  current_period_start?: Date
  current_period_end?: Date
  cancel_at_period_end: boolean
}

export interface Session {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}
