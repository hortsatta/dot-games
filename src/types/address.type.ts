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
