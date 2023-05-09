export type GameDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    slug: string;
    bg_image_offset_posx: number | null;
    bg_image_offset_posy: number | null;
    backdrop_opacity: number | null;
    genres: number[] | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    slug: string;
    bg_image_offset_posx?: number | null;
    bg_image_offset_posy?: number | null;
    backdrop_opacity?: number | null;
    genres?: number[] | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    slug?: string;
    bg_image_offset_posx?: number | null;
    bg_image_offset_posy?: number | null;
    backdrop_opacity?: number | null;
    genres?: number[] | null;
  };
};
