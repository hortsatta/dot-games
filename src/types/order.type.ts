import type { BaseColumns, BaseJsonDb } from './base.type';
import type { Address } from './address.type';

export type OrderItem = {
  item: {
    discount: number;
    price: number;
    finalPrice: number;
    gameIds?: number[];
  };
  quantity: number;
};

export type Order = Omit<BaseColumns, 'isActive'> & {
  userId: string;
  piClientSecret: string;
  shippingFee: number;
  address: Address;
  totalAmount: number;
  orderItems: OrderItem[];
  date?: string;
  status?: number;
};

export type OrderDb = {
  Row: {
    id: number;
    created_at: string;
    user_id: string;
    pi_client_secret: string | null;
    date: string | null;
    shipping_fee: number | null;
    address: BaseJsonDb | null;
    total_amount: number | null;
    order_items: BaseJsonDb | null;
    status: number | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    user_id?: string;
    pi_client_secret?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: BaseJsonDb | null;
    total_amount?: number | null;
    order_items?: BaseJsonDb | null;
    status?: number | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    user_id?: string;
    pi_client_secret?: string | null;
    date?: string | null;
    shipping_fee?: number | null;
    address?: BaseJsonDb | null;
    total_amount?: number | null;
    order_items?: BaseJsonDb | null;
    status?: number | null;
  };
};
