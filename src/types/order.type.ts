import { BaseJsonDb } from './base.type';

export type OrderDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    payment_intent: string | null;
    date: string | null;
    shipping_fee: number | null;
    address: BaseJsonDb | null;
    total_price: number | null;
    order_items: BaseJsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id: string;
    payment_intent?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: BaseJsonDb | null;
    total_price?: number | null;
    order_items?: BaseJsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    payment_intent?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: BaseJsonDb | null;
    total_price?: number | null;
    order_items?: BaseJsonDb | null;
  };
};
