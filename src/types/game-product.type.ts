import type { BaseColumns } from './base.type';
import type { Game } from './game.type';

export type GameProduct = BaseColumns & {
  games: Game[];
  discount: number;
  price: number;
  finalPrice: number;
};

export type GameProductDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    game_ids: number[];
    price: number;
    discount: number;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    game_ids: number[];
    price?: number;
    discount?: number;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    game_ids?: number[];
    price?: number;
    discount?: number;
  };
};
