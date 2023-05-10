export type GenreDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    slug: string;
    custom_slug: string | null;
    name: string | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    slug: string;
    custom_slug: string | null;
    name?: string | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    slug?: string;
    custom_slug?: string | null;
    name?: string | null;
  };
};
