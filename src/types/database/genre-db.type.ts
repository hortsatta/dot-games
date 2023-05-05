export type GenreDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    rawg_slug: string;
    slug: string;
    name: string | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    rawg_slug: string;
    slug: string;
    name?: string | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    rawg_slug?: string;
    slug?: string;
    name?: string | null;
  };
};
