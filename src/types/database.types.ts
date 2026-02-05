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
            links: {
                Row: {
                    id: string
                    user_id: string
                    slug: string
                    target_url: string
                    clicks: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    slug: string
                    target_url: string
                    clicks?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    slug?: string
                    target_url?: string
                    clicks?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "links_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
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
