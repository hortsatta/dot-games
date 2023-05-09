import { BaseJsonDb } from './base.type';

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
