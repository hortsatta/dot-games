import type { BaseColumns } from './base.type';

export type CountryOption = {
  code: string;
  name: string;
};

export type Address = BaseColumns & {
  isDefault: boolean;
  userId: string;
  fullName: string;
  phoneNumber: string | null;
  zipCode: number | null;
  addressLine: string | null;
  country: string | null;
  city: string | null;
};

export type AddressDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    is_default: boolean;
    user_id: string;
    full_name: string;
    phone_number: string | null;
    zip_code: number | null;
    address_line: string | null;
    country: string | null;
    city: string | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    is_default?: boolean;
    user_id: string;
    full_name: string;
    phone_number?: string | null;
    zip_code?: number | null;
    address_line?: string | null;
    country?: string | null;
    city?: string | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    is_default?: boolean;
    user_id?: string;
    full_name?: string;
    phone_number?: string | null;
    zip_code?: number | null;
    address_line?: string | null;
    country?: string | null;
    city?: string | null;
  };
};
