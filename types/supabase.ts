export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          image_url: string | null
          author: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          image_url?: string | null
          author: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          image_url?: string | null
          author?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          date: string
          time: string
          location: string
          town_id: string | null
          organizer: string | null
          phone: string | null
          image_url: string | null
          category_id: string | null
          featured: boolean
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          date: string
          time: string
          location: string
          town_id?: string | null
          organizer?: string | null
          phone?: string | null
          image_url?: string | null
          category_id?: string | null
          featured?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          town_id?: string | null
          organizer?: string | null
          phone?: string | null
          image_url?: string | null
          category_id?: string | null
          featured?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          user_id: string
          event_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      saved_events: {
        Row: {
          id: string
          user_id: string
          event_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string | null
          event_id: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url?: string | null
          event_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string | null
          event_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      towns: {
        Row: {
          id: string
          name: string
          region: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          region?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          region?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
