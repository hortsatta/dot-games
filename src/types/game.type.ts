import type { BaseColumns } from './base.type';
import type { Genre } from './genre.type';

type Platform = {
  slug: string;
  name: string;
};

type Developer = {
  slug: string;
  name: string;
};

type Publisher = {
  slug: string;
  name: string;
};

type EsrbRating = {
  slug: string;
  name: string;
};

export type Game = BaseColumns & {
  slug: string;
  name: string;
  description: string;
  metaScore: number;
  released: string;
  isReleased: boolean;
  tba: boolean;
  bgImage: string;
  website: string;
  parentPlatforms: string[];
  platforms: Platform[];
  developers: Developer[];
  publishers: Publisher[];
  genres: Genre[];
  esrbRating: EsrbRating | null;
  metacriticUrl?: string;
  bgImageAdditional?: string;
  bgImageOffsetPosX?: number | null;
  bgImageOffsetPosY?: number | null;
  backdropOpacity?: number;
};

export type GameDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    slug: string;
    custom_slug: string | null;
    bg_image_offset_posx: number | null;
    bg_image_offset_posy: number | null;
    backdrop_opacity: number;
    genres: number[];
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    slug: string;
    custom_slug: string | null;
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
    custom_slug?: string | null;
    bg_image_offset_posx?: number | null;
    bg_image_offset_posy?: number | null;
    backdrop_opacity?: number | null;
    genres?: number[] | null;
  };
};
