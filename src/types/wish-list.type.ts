import type { BaseColumns } from './base.type';
import type { GameProduct } from './game-product.type';

export type WishListGameProduct = {
  gameProductId: number;
  gameProduct?: GameProduct;
};

export type WishList = Omit<BaseColumns, 'isActive'> & {
  gameProducts: WishListGameProduct[];
  userId?: string;
};

export type WishListDb = {
  Row: {
    id: number;
    created_at: string;
    game_product_ids: number[];
    user_id: string;
  };
  Insert: {
    id?: number;
    created_at?: string;
    game_product_ids: number[];
    user_id: string;
  };
  Update: {
    id?: number;
    created_at?: string;
    game_product_ids?: number[];
    user_id?: string;
  };
};
