import type { BaseColumns, BaseJsonDb } from './base.type';
import type { GameProduct } from './game-product.type';

export type CartItem = {
  gameProductId: string | number;
  quantity: number;
  gameProduct?: GameProduct;
};

export type Cart = Omit<BaseColumns, 'isActive'> & {
  cartItems: CartItem[];
  userId?: string;
  piClientSecret?: string | null;
};

export type CartDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    payment_intent_id: string | null;
    cart_items: BaseJsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent_id?: string | null;
    cart_items?: BaseJsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent_id?: string | null;
    cart_items?: BaseJsonDb | null;
  };
};
