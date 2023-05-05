import type { JsonDb } from './json-db.type';

export type CartDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    payment_intent: string | null;
    cart_items: JsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    cart_items?: JsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    cart_items?: JsonDb | null;
  };
};
