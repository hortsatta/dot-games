import type { JsonDb } from './json-db.type';

export type OrderDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    payment_intent: string | null;
    date: string | null;
    shipping_fee: number | null;
    address: JsonDb | null;
    total_price: number | null;
    order_items: JsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id: string;
    payment_intent?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: JsonDb | null;
    total_price?: number | null;
    order_items?: JsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: JsonDb | null;
    total_price?: number | null;
    order_items?: JsonDb | null;
  };
};
