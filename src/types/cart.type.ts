import type { BaseColumns, BaseJsonDb } from './base.type';

export type CartItem = {
  gameProductId: string | number;
  quantity: number;
};

export type Cart = Omit<BaseColumns, 'isActive'> & {
  cartItems: CartItem[];
  userId?: string;
  clientSecret?: string | null;
};

export type CartDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    payment_intent: string | null;
    cart_items: BaseJsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    cart_items?: BaseJsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    cart_items?: BaseJsonDb | null;
  };
};
