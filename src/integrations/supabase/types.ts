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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          paper_id: string
          parent_id: string | null
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string
          id?: string
          paper_id: string
          parent_id?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          paper_id?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          created_at: string
          feedback: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      datesheets: {
        Row: {
          branch: string
          created_at: string
          created_by_name: string
          exam_date: string
          exam_time: string | null
          exam_type: string
          id: string
          pinned: boolean
          section: string
          semester: number
          subject: string
          venue: string | null
        }
        Insert: {
          branch: string
          created_at?: string
          created_by_name?: string
          exam_date: string
          exam_time?: string | null
          exam_type: string
          id?: string
          pinned?: boolean
          section: string
          semester: number
          subject: string
          venue?: string | null
        }
        Update: {
          branch?: string
          created_at?: string
          created_by_name?: string
          exam_date?: string
          exam_time?: string | null
          exam_type?: string
          id?: string
          pinned?: boolean
          section?: string
          semester?: number
          subject?: string
          venue?: string | null
        }
        Relationships: []
      }
      paper_stars: {
        Row: {
          created_at: string
          id: string
          paper_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paper_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paper_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_stars_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_upvotes: {
        Row: {
          created_at: string
          id: string
          paper_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paper_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paper_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_upvotes_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      papers: {
        Row: {
          approved: boolean
          branch: string
          created_at: string
          description: string | null
          downloads: number
          exam_type: string
          file_path: string
          file_size: number | null
          id: string
          program: string
          reviewed_at: string | null
          reviewed_by: string | null
          section: string
          semester: number
          stars: number
          subject: string
          tags: string[] | null
          title: string | null
          uploader_id: string | null
          uploader_name: string
          upvotes: number
          year: number
        }
        Insert: {
          approved?: boolean
          branch: string
          created_at?: string
          description?: string | null
          downloads?: number
          exam_type: string
          file_path: string
          file_size?: number | null
          id?: string
          program?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          section: string
          semester: number
          stars?: number
          subject: string
          tags?: string[] | null
          title?: string | null
          uploader_id?: string | null
          uploader_name?: string
          upvotes?: number
          year: number
        }
        Update: {
          approved?: boolean
          branch?: string
          created_at?: string
          description?: string | null
          downloads?: number
          exam_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          program?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          section?: string
          semester?: number
          stars?: number
          subject?: string
          tags?: string[] | null
          title?: string | null
          uploader_id?: string | null
          uploader_name?: string
          upvotes?: number
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          semester: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          semester?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          semester?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repeated_question_votes: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repeated_question_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "repeated_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      repeated_questions: {
        Row: {
          branch: string
          contributor_id: string | null
          contributor_name: string
          created_at: string
          id: string
          marks: number | null
          notes: string | null
          question: string
          semester: number
          subject: string
          unit_number: number | null
          upvotes: number
          years: number[] | null
        }
        Insert: {
          branch: string
          contributor_id?: string | null
          contributor_name?: string
          created_at?: string
          id?: string
          marks?: number | null
          notes?: string | null
          question: string
          semester: number
          subject: string
          unit_number?: number | null
          upvotes?: number
          years?: number[] | null
        }
        Update: {
          branch?: string
          contributor_id?: string | null
          contributor_name?: string
          created_at?: string
          id?: string
          marks?: number | null
          notes?: string | null
          question?: string
          semester?: number
          subject?: string
          unit_number?: number | null
          upvotes?: number
          years?: number[] | null
        }
        Relationships: []
      }
      subject_units: {
        Row: {
          branch: string
          created_at: string
          id: string
          semester: number
          subject: string
          unit_name: string
          unit_number: number
        }
        Insert: {
          branch: string
          created_at?: string
          id?: string
          semester: number
          subject: string
          unit_name: string
          unit_number: number
        }
        Update: {
          branch?: string
          created_at?: string
          id?: string
          semester?: number
          subject?: string
          unit_name?: string
          unit_number?: number
        }
        Relationships: []
      }
      subjects: {
        Row: {
          branch: string
          created_at: string
          hidden: boolean
          id: string
          name: string
          semester: number
        }
        Insert: {
          branch: string
          created_at?: string
          hidden?: boolean
          id?: string
          name: string
          semester: number
        }
        Update: {
          branch?: string
          created_at?: string
          hidden?: boolean
          id?: string
          name?: string
          semester?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_paper_downloads: {
        Args: { paper_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
