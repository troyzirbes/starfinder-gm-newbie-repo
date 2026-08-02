export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      campaign_invites: {
        Row: {
          accepted_at: string | null
          campaign_id: string
          created_at: string
          email: string
          id: string
          invited_by: string | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          campaign_id: string
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          campaign_id?: string
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_invites_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_members: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_members_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          gm_token: string
          id: string
          name: string
          owner_id: string | null
          player_token: string
          system: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gm_token: string
          id?: string
          name: string
          owner_id?: string | null
          player_token: string
          system?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gm_token?: string
          id?: string
          name?: string
          owner_id?: string | null
          player_token?: string
          system?: string
          updated_at?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          campaign_id: string
          created_at: string
          gm_secrets: string
          hints: string[]
          hints_revealed: number
          id: string
          image_url: string
          name: string
          order_index: number
          player_text: string
          reveal_state: string
          session_number: number | null
          solution: string
          stat_block: string
          subtitle: string
          tags: string[]
          type: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          gm_secrets?: string
          hints?: string[]
          hints_revealed?: number
          id?: string
          image_url?: string
          name?: string
          order_index?: number
          player_text?: string
          reveal_state?: string
          session_number?: number | null
          solution?: string
          stat_block?: string
          subtitle?: string
          tags?: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          gm_secrets?: string
          hints?: string[]
          hints_revealed?: number
          id?: string
          image_url?: string
          name?: string
          order_index?: number
          player_text?: string
          reveal_state?: string
          session_number?: number | null
          solution?: string
          stat_block?: string
          subtitle?: string
          tags?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achieved: boolean
          campaign_id: string
          created_at: string
          description: string
          gm_notes: string
          id: string
          order_index: number
          session_number: number | null
          title: string
          updated_at: string
          visible_to_players: boolean
        }
        Insert: {
          achieved?: boolean
          campaign_id: string
          created_at?: string
          description?: string
          gm_notes?: string
          id?: string
          order_index?: number
          session_number?: number | null
          title?: string
          updated_at?: string
          visible_to_players?: boolean
        }
        Update: {
          achieved?: boolean
          campaign_id?: string
          created_at?: string
          description?: string
          gm_notes?: string
          id?: string
          order_index?: number
          session_number?: number | null
          title?: string
          updated_at?: string
          visible_to_players?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "milestones_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          email?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          campaign_id: string
          created_at: string
          fallbacks: string
          gm_notes: string
          goals: string
          id: string
          intro: string
          intro_published: boolean
          number: number
          recap: string
          recap_published: boolean
          scenes: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          fallbacks?: string
          gm_notes?: string
          goals?: string
          id?: string
          intro?: string
          intro_published?: boolean
          number: number
          recap?: string
          recap_published?: boolean
          scenes?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          fallbacks?: string
          gm_notes?: string
          goals?: string
          id?: string
          intro?: string
          intro_published?: boolean
          number?: number
          recap?: string
          recap_published?: boolean
          scenes?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
